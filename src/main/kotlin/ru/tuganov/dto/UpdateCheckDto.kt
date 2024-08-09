package ru.tuganov.dto

class UpdateCheckDto (
    val checkId: Int,
    val description: String?,
    val expense: Int?,
    val tagId: Int?
){
}