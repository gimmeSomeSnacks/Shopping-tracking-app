package ru.tuganov.controllers

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.tuganov.entities.Check
import ru.tuganov.entities.Page
import ru.tuganov.entities.dto.FindCheckDto
import ru.tuganov.entities.dto.PageDto
import ru.tuganov.services.CheckService

@RestController
class AccountController @Autowired constructor(
    private val checkService: CheckService
) {
    @GetMapping("/list-of-pages")
    fun getListOfPages(): ResponseEntity<List<Page>> {
        return ResponseEntity(checkService.findPages(), HttpStatus.OK)
    }

    @GetMapping("/checks/date")
    fun getChecks(@RequestBody findCheckDto: FindCheckDto): ResponseEntity<Page> {
        return ResponseEntity(checkService.findChecksByPageIdAndDate(findCheckDto), HttpStatus.OK)
    }

    @PostMapping("/save-changes")
    fun saveChanges(@RequestBody pageDto: PageDto): ResponseEntity<String> {
        checkService.savePage(pageDto)
        return ResponseEntity("saves", HttpStatus.OK)
    }
}