package ru.tuganov.controllers

import org.hibernate.query.Page
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.tuganov.entities.Check
import ru.tuganov.entities.dto.FindCheckDto
import ru.tuganov.services.CheckService

@RestController
@RequestMapping("/page")
class PageController @Autowired constructor(
    private val checkService: CheckService
) {
    @PostMapping("/selected-date")
    fun getSelectedDateChecks(@RequestBody findCheckDto: FindCheckDto): ResponseEntity<List<Check>> {
        return ResponseEntity(checkService.findChecks(findCheckDto), HttpStatus.OK)
    }

    @PostMapping("/save-check")
    fun saveCheck(@RequestBody check: Check): ResponseEntity<String> {
        checkService.saveCheck(check)
        return ResponseEntity("saved check", HttpStatus.OK)
    }

    @PostMapping("/delete-check/{checkId}")
    fun deleteCheck(@PathVariable checkId: Int): ResponseEntity<String> {
        checkService.deleteCheck(checkId)
        return ResponseEntity("deleted check", HttpStatus.OK)
    }

    @PostMapping("/edit")
    fun editCheck(@RequestBody check: Check): ResponseEntity<String> {
        checkService.updateCheck(check)
        return ResponseEntity("edited check", HttpStatus.OK)
    }
}