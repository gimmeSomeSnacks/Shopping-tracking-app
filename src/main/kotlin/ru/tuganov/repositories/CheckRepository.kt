package ru.tuganov.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ru.tuganov.entities.Check

@Repository
interface CheckRepository: JpaRepository<Check, Long> {
    fun findChecksById(id: Long): List<Check>
}