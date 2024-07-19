package ru.tuganov.entities.dto

import ru.tuganov.entities.Check
import ru.tuganov.entities.Tag

class PageDto (
    private val pageName: String,
    private val checkList: List<Check>,
    private val tagList: List<Tag>,
    private val expectedExpenses: Int
) {
    fun getChecks() = checkList
    fun getPageName() = pageName
    fun getExpectedExpenses() = expectedExpenses
    fun getTagList() = tagList
}