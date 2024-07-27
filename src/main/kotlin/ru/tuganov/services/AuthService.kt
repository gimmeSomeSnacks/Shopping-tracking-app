package ru.tuganov.services

import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.tuganov.entities.User
import ru.tuganov.entities.dto.SignInDto
import ru.tuganov.entities.dto.SignUpDto
import ru.tuganov.security.CookieProvider
import ru.tuganov.security.JwtProvider
import ru.tuganov.security.Role

@Service
class AuthService @Autowired constructor(
    @Value("\${jwt.access-expire}") private val accessExpire: Int,
    @Value("\${jwt.refresh-expire}") private val refreshExpire: Int,
    val cookieProvider: CookieProvider,
    val jwtProvider: JwtProvider,
    val authenticationManager: AuthenticationManager,
    val userService: UserService,
    val passwordEncoder: PasswordEncoder
) {
    private val logger = LoggerFactory.getLogger(AuthService::class.java)
    fun signInUser(response: HttpServletResponse, signInDto: SignInDto) {
        val user = userService.loadUserByUsername(signInDto.username)
        if (user != null) {
            logger.info("in signInUser + ${signInDto.username}")
            val accessToken = jwtProvider.generateToken(user, accessExpire)
            val refreshToken = jwtProvider.generateToken(user, refreshExpire)
            cookieProvider.setTokenToCookies(response, "accessToken", accessToken, accessExpire)
            cookieProvider.setTokenToCookies(response, "refreshToken", refreshToken, refreshExpire)
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    signInDto.username,
                    signInDto.password
                )
            )
        }
    }

    fun signUpUser(response: HttpServletResponse, signUpDto: SignUpDto) {
        val role = Role.USER
        val newUser = User(signUpDto.username, passwordEncoder.encode(signUpDto.password), signUpDto.email, role)
        userService.saveUser(newUser)
    }
}