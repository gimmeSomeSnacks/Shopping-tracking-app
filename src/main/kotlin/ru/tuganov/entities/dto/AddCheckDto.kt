package ru.tuganov.entities.dto

import java.time.LocalDate

class AddCheckDto (
    val pageId: Int,
    val date: LocalDate,
    val tagId: Int
){
}