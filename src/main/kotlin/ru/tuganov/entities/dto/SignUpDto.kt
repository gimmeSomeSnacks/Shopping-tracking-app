package ru.tuganov.entities.dto

class SignUpDto(
    private val username: String,
    private val password: String,
    private val email: String,
) {
    fun getUserName() = username
    fun getPassword() = password
    fun getEmail() = email
}