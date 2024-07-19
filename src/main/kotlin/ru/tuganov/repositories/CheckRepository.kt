package ru.tuganov.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ru.tuganov.entities.Check
import ru.tuganov.entities.Page
import java.util.*

@Repository
interface CheckRepository: JpaRepository<Check, Long> {
}