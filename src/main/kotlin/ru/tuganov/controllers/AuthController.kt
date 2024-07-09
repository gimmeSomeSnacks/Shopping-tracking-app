package ru.tuganov.controllers

import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
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
    fun signIn(response: HttpServletResponse, @RequestBody signIn: SignIn): String {
        return authService.signInUser(response, signIn)
    }

    @PostMapping("/sign-up")
    fun signUp(response: HttpServletResponse, @RequestBody signUp: SignUp) {
        authService.signUpUser(response, signUp)
    }
}