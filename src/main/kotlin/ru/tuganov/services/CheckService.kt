package ru.tuganov.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.tuganov.entities.Check
import ru.tuganov.repositories.CheckRepository

@Service
class CheckService @Autowired constructor(
    private val checkRepository: CheckRepository
) {
    fun saveChecks(checkList: List<Check>) = checkList.forEach { checkRepository.save(it) }

    fun getChecksByUserId(id: Long): List<Check> = checkRepository.findChecksById(id)
}