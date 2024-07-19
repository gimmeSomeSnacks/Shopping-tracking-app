package ru.tuganov.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import ru.tuganov.entities.User
import ru.tuganov.repositories.UserRepository

@Service
class UserService @Autowired constructor(
    private val userRepository: UserRepository
): UserDetailsService {
    override fun loadUserByUsername(username: String): User? = userRepository.findByUsername(username)
    fun saveUser(user: User): User = userRepository.save(user)

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