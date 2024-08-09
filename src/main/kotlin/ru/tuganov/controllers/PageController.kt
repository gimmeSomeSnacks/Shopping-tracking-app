package ru.tuganov.controllers

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.tuganov.dto.*
import ru.tuganov.entities.Check
import ru.tuganov.services.CheckService
import ru.tuganov.services.PageService
import ru.tuganov.services.TagService

@RestController
@RequestMapping("/page")
class PageController @Autowired constructor(
    private val checkService: CheckService,
    private val tagService: TagService,
    private val pageService: PageService
) {
    private val logger = LoggerFactory.getLogger(PageController::class.java)

    @PostMapping("/selected-date")
    fun getSelectedDateChecks(@RequestBody findChecksDto: FindChecksDto): ResponseEntity<List<Check>> {
        val checks = checkService.findChecks(findChecksDto)
        return ResponseEntity(checks, HttpStatus.OK)
    }

    @PostMapping("/add-check")
    fun addCheck(@RequestBody addCheckDto: AddCheckDto): ResponseEntity<Int> {
        return ResponseEntity(checkService.addCheck(addCheckDto), HttpStatus.OK)
    }

    @GetMapping("/delete-check/{checkId}")
    fun deleteCheck(@PathVariable checkId: Int): ResponseEntity<String> {
        checkService.deleteCheck(checkId)
        return ResponseEntity("deleted check", HttpStatus.OK)
    }

    @PostMapping("/update-check")
    fun editCheck(@RequestBody updateCheckDto: UpdateCheckDto): ResponseEntity<String> {
        logger.info("check update");
        checkService.updateCheck(updateCheckDto)
        return ResponseEntity("updated check", HttpStatus.OK)
    }

    @GetMapping("/add-tag/{pageId}")
    fun addTag(@PathVariable pageId: Int): ResponseEntity<Int> {
        return ResponseEntity(tagService.addNewTag(pageId), HttpStatus.OK)
    }

    @GetMapping("/delete-tag/{tagId}")
    fun deleteTag(@PathVariable tagId: Int): ResponseEntity<String> {
        logger.info("delete tag");
        tagService.deleteTag(tagId)
        return ResponseEntity("deleted tag", HttpStatus.OK)
    }

    @PostMapping("/edit-tag")
    fun editTag(@RequestBody tagDto: TagDto): ResponseEntity<String> {
        tagService.editTag(tagDto)
        return ResponseEntity("edited tag", HttpStatus.OK)
    }

    @PostMapping("/expected-expenses")
    fun editExpenses(@RequestBody expectedExpensesDto: ExpectedExpensesDto): ResponseEntity<String> {
        pageService.editExpenses(expectedExpensesDto);
        return ResponseEntity("edited expenses", HttpStatus.OK)
    }
}