package ru.tuganov.entities.dto

class SignIn (
    private val username: String,
    private val password: String
) {
    fun getUsername() = username
    fun getPassword() = password
}