package ru.tuganov.controllers

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.tuganov.entities.Check
import ru.tuganov.entities.Page
import ru.tuganov.entities.dto.FindCheckDto
import ru.tuganov.entities.dto.PageDto
import ru.tuganov.services.CheckService
import ru.tuganov.services.PageService

@RestController
@RequestMapping("/pages")
class PageListController @Autowired constructor(
    private val pageService: PageService,
    private val checkService: CheckService
) {
    private val logger = LoggerFactory.getLogger(PageListController::class.java)
    @GetMapping("")
    fun getListOfPages(): ResponseEntity<List<Page>> {
        logger.info("get list of pages")
        return ResponseEntity(pageService.findPages(), HttpStatus.OK)
    }

    @PostMapping("/add-page")
    fun saveNewPage(@RequestBody pageName: String): ResponseEntity<Int> {
        logger.info("save page $pageName")
        return ResponseEntity(pageService.addPage(pageName), HttpStatus.OK)
    }

    @PostMapping("/edit")
    fun editPage(@RequestBody pageDto: PageDto): ResponseEntity<String> {
        logger.info("edit page ${pageDto.id}")
        pageService.editPage(pageDto)
        return ResponseEntity("edited", HttpStatus.OK)
    }

    @GetMapping("/delete/{id}")
    fun deletePage(@PathVariable id: Int): ResponseEntity<String> {
        logger.info("delete page $id")
        pageService.deletePage(id)
        return ResponseEntity("deleted", HttpStatus.OK)
    }

    @PostMapping("/checks")
    fun getChecks(@RequestBody findCheckDto: FindCheckDto): ResponseEntity<List<Check>> {
        return ResponseEntity(checkService.findChecks(findCheckDto), HttpStatus.OK)
    }
}