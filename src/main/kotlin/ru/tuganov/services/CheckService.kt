package ru.tuganov.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.tuganov.entities.Check
import ru.tuganov.entities.dto.FindCheckDto
import ru.tuganov.repositories.CheckRepository
import ru.tuganov.repositories.PageRepository

@Service
class CheckService @Autowired constructor(
    private val pageRepository: PageRepository,
    private val checkRepository: CheckRepository
) {
    fun findChecks(findCheckDto: FindCheckDto): List<Check> {
        return checkRepository.findAllByDateAndPage(findCheckDto.date, pageRepository.findPageById(findCheckDto.pageId))
    }

    fun saveCheck(check: Check) {
        val page = pageRepository.findPageById(check.page.id as Int);
        page.checkList.add(check)
        pageRepository.save(page)
        checkRepository.save(check)
    }


    fun updateCheck(check: Check) {
        val id = check.page.id as Int
        val page = pageRepository.findPageById(id);
        page.checkList[id] = check
        pageRepository.save(page)
        checkRepository.save(check)
    }

    fun deleteCheck (checkId: Int) {
        checkRepository.deleteById(checkId)
    }
}