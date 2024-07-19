package ru.tuganov.entities.dto

class SignInDto (
    private val username: String,
    private val password: String
) {
    fun getUsername() = username
    fun getPassword() = password
}