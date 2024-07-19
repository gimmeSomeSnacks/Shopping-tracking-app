package ru.tuganov.controllers

import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.tuganov.entities.dto.SignIn
import ru.tuganov.entities.dto.SignUp
import ru.tuganov.services.AuthService

@RestController
class AuthController @Autowired constructor(
    val authService: AuthService
) {

    @PostMapping("/sign-in")
    fun signIn(response: HttpServletResponse, @RequestBody signIn: SignIn): ResponseEntity<String> {
        authService.signInUser(response, signIn)
        return ResponseEntity("sign-in", HttpStatus.OK)
    }

    @PostMapping("/sign-up")
    fun signUp(response: HttpServletResponse, @RequestBody signUp: SignUp): HttpStatus {
        authService.signUpUser(response, signUp)
        return HttpStatus.OK
    }
}