package ru.tuganov.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ru.tuganov.entities.User

@Repository
interface UserRepository: JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
}