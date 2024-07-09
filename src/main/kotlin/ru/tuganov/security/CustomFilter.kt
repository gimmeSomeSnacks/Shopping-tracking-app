package ru.tuganov.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import ru.tuganov.services.UserService

@Component
class CustomFilter @Autowired constructor(
    private val jwtProvider: JwtProvider,
    private val userService: UserService
): OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val header = request.getHeader("Authorization")
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
        }
        var token  = header.substring("Bearer ".length)
        if (jwtProvider.isValid(token)) {
            if (jwtProvider.isTokenExpired(token)) {
                token = jwtProvider.reGenerateToken(token)
            }
            val user = userService.loadUserByUsername(jwtProvider.extractUserName(token))
            val context = SecurityContextHolder.createEmptyContext()
            val authToken = UsernamePasswordAuthenticationToken(user, null, user.authorities)
            authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
            context.setAuthentication(authToken)
            SecurityContextHolder.setContext(context)
        }
        filterChain.doFilter(request, response)
    }
}