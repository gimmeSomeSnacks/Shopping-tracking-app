package ru.tuganov.entities.dto

import java.time.LocalDate

class FindCheckDto (
    private val pageId: Long,
    private val date: LocalDate
){
    fun getPageId(): Long = pageId
    fun getDate(): LocalDate = date
}