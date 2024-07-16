package ru.tuganov.controllers

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.tuganov.entities.Check
import ru.tuganov.services.CheckService

@RestController
class AccountController @Autowired constructor(
    private val checkService: CheckService
) {

    @PostMapping("/save-changes")
    fun saveChanges(@RequestBody checkList: List<Check>): String {
        return "redirect:account"
    }


//    @GetMapping("/check-list/{id}")
//    fun getCheckList(@PathVariable id: Long): List<Check> {
//        return checkService.getChecksByUserId(id)
//    }
}