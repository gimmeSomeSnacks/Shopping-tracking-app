package ru.tuganov.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import ru.tuganov.entities.User
import ru.tuganov.services.UserService
import java.security.Key
import java.util.*


@Component
class JwtProvider @Autowired constructor(
    private val userService: UserService
    ) {
    @Value("\${jwt.secret-key}") private val jwtKey: String = ""

    fun isValid(token: String): Boolean {
        try {
            val userName = extractUserName(token)
            val user = userService.loadUserByUsername(userName)
            return user != null
        } catch (e: Exception) {
            return false
        }
    }

    fun extractUserName(token: String): String {
        return extractClaim(token) { it.subject }
    }

    private inline fun <T> extractClaim(token: String, crossinline claimsResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser().setSigningKey(getSigningKey()).build().parseClaimsJws(token).body
    }

    fun isTokenExpired(token: String): Boolean {
        return try {
            extractExpiration(token).before(Date())
        } catch (e: Exception) {
            true
        }
    }

    private fun extractExpiration(token: String): Date {
        return extractClaim(token) { it.expiration }
    }

    fun generateToken(user: User, expire: Int): String {
        val extraClaims: MutableMap<String, Any> = mutableMapOf(
            "id" to user.getId(),
            "username" to user.getUsername(),
            "authorities" to user.getAuthorities())
        val currentTime: Long = System.currentTimeMillis()
        return Jwts.builder().setClaims(extraClaims).setSubject(user.getUsername())
                            .setIssuedAt(Date(currentTime)).setExpiration(Date(currentTime + expire))
                            .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact()
    }

    fun getSigningKey(): Key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtKey))
}