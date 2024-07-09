package ru.tuganov.services

import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.tuganov.entities.User
import ru.tuganov.entities.dto.SignIn
import ru.tuganov.entities.dto.SignUp
import ru.tuganov.security.JwtProvider
import ru.tuganov.security.Role

@Service
class AuthService @Autowired constructor(
    val jwtProvider: JwtProvider,
    val passwordEncoder: PasswordEncoder,
    val authenticationManager: AuthenticationManager,
    val userService: UserService,
    @Value("\${jwt.expire}") val jwtExpire: Long
) {

    fun signInUser(response: HttpServletResponse, signIn: SignIn): String {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                signIn.getUsername(),
                signIn.getPassword()
            )
        )

        val user = userService.loadUserByUsername(signIn.getUsername())
        return jwtProvider.generateToken(user, jwtExpire)
    }

    fun signUpUser(response: HttpServletResponse, signUp: SignUp) {
        val role = Role.ROLE_USER
        val newUser = User(signUp.getUserName(), signUp.getPassword(), signUp.getEmail(), role)
        userService.saveUser(newUser)
    }

    fun currentUser(): UserDetails? {
        val authentication: Authentication? = SecurityContextHolder.getContext().authentication
        if (authentication != null && authentication.isAuthenticated) {
            val principal = authentication.principal
            if (principal is UserDetails) {
                return principal
            }
        }
        return null
    }
}