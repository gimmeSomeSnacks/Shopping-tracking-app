package ru.tuganov.services

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.tuganov.controllers.PageController
import ru.tuganov.entities.Check
import ru.tuganov.entities.dto.AddCheckDto
import ru.tuganov.entities.dto.UpdateCheckDto
import ru.tuganov.entities.dto.FindChecksDto
import ru.tuganov.repositories.CheckRepository

@Service
class CheckService @Autowired constructor(
    private val pageService: PageService,
    private val checkRepository: CheckRepository,
    private val tagService: TagService
) {
    private val logger = LoggerFactory.getLogger(CheckService::class.java)
    fun findChecks(findChecksDto: FindChecksDto): List<Check> {
        return checkRepository.findAllByDateAndPage(findChecksDto.date, pageService.findPageById(findChecksDto.pageId))
    }

    fun addCheck(addCheckDto: AddCheckDto): Int {
        val check = Check(
            pageService.findPageById(addCheckDto.pageId),
            "",
            0,
            addCheckDto.date,
            tagService.findTagById(addCheckDto.tagId)
        )
        checkRepository.save(check)
        return check.id as Int
    }

    fun updateCheck(updateCheckDto: UpdateCheckDto) {
        val check = checkRepository.findCheckById(updateCheckDto.checkId)
        check.expense = updateCheckDto.expense as Int
        if (updateCheckDto.tagId != null) {
//            logger.info(updateCheckDto.tagId.toString());
            check.tag = tagService.findTagById(updateCheckDto.tagId)
//            logger.info("tag = " + check.tag)
        }
        check.description = updateCheckDto.description as String
        checkRepository.save(check)
    }

    fun deleteCheck (checkId: Int) {
        checkRepository.deleteById(checkId)
    }
}