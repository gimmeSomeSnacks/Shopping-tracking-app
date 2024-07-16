package ru.tuganov.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import ru.tuganov.entities.User
import ru.tuganov.services.UserService

@Component
class CustomFilter @Autowired constructor(
    @Value("\${jwt.access-expire}") private val accessExpire: Int,
    @Value("\${jwt.refresh-expire}") private val refreshExpire: Int,
    private val jwtProvider: JwtProvider,
    private val cookieProvider: CookieProvider,
    private val userService: UserService,
): OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val accessTokenName = "accessToken"
        val refreshTokenName = "refreshToken"
        var accessToken = cookieProvider.getTokenFromCookies(request, accessTokenName)
        var refreshToken = cookieProvider.getTokenFromCookies(request, refreshTokenName)

        if (accessToken == null || refreshToken == null) {
            logger.info("null tokens")
            filterChain.doFilter(request, response)
            return
        }

        if (jwtProvider.isTokenExpired(accessToken)) {
            logger.info("access expired")
            if (jwtProvider.isTokenExpired(refreshToken) || !jwtProvider.isValid(refreshToken)) {
                logger.info("expired both")
                cookieProvider.deleteCookies(response, accessTokenName)
                cookieProvider.deleteCookies(response, refreshTokenName)
                filterChain.doFilter(request, response)
                return
            }
            logger.info("valid refresh")
            val username = jwtProvider.extractUserName(refreshToken)
            val user = userService.loadUserByUsername(username) as User
            accessToken = jwtProvider.generateToken(user, accessExpire)
            refreshToken = jwtProvider.generateToken(user, refreshExpire)
            cookieProvider.setTokenToCookies(response, accessTokenName, accessToken, accessExpire)
            cookieProvider.setTokenToCookies(response, refreshTokenName, refreshToken, refreshExpire)
        }

        if (jwtProvider.isValid(accessToken) && jwtProvider.isValid(refreshToken)) {
            logger.info("valid tokens")
            val username = jwtProvider.extractUserName(accessToken)
            val user = userService.loadUserByUsername(username) as User
            val context = SecurityContextHolder.createEmptyContext()
            val authenticationToken = UsernamePasswordAuthenticationToken(user, null, user.authorities)
            authenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
            context.authentication = authenticationToken
            SecurityContextHolder.setContext(context)
        }
        val user = currentUser()
        logger.info("current user:" + user?.username + "; role: " + user?.authorities)
        filterChain.doFilter(request, response)
    }

    fun currentUser(): User? {
        val authentication: Authentication? = SecurityContextHolder.getContext().authentication
        if (authentication != null && authentication.isAuthenticated) {
            val principal = authentication.principal
            if (principal is UserDetails) {
                return principal as User
            }
        }
        return null
    }
}