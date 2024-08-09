package ru.tuganov.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.tuganov.entities.Page
import ru.tuganov.dto.ExpectedExpensesDto
import ru.tuganov.dto.PageDto
import ru.tuganov.repositories.PageRepository

@Service
class PageService @Autowired constructor(
    private val pageRepository: PageRepository,
    private val userService: UserService
){

    fun findPageById(id: Int): Page {
        return pageRepository.findPageById(id)
    }

    fun save(page: Page) {
        pageRepository.save(page)
    }

    fun findPages(): List<Page> {
        val currentUser = userService.currentUser()
        if (currentUser != null) {
            return pageRepository.findAllByUser(currentUser)
        }
        return listOf()
    }

    fun editPage(pageDto: PageDto) {
        val page = pageRepository.findPageById(pageDto.id)
        page.pageName = (pageDto.pageName)
        pageRepository.save(page)
    }

    fun addPage(pageName: String): Int? {
        val currentUser = userService.currentUser()
        if (currentUser != null) {
            val page = Page (
                currentUser,
                mutableListOf(),
                mutableListOf(),
                pageName,
                0
            )
            pageRepository.save(page)
            return page.id as Int;
        }
        return null;
    }

    fun deletePage(pageId: Int) {
        pageRepository.deleteById(pageId)
    }

    fun editExpenses(expectedExpensesDto: ExpectedExpensesDto) {
        val page = pageRepository.findPageById(expectedExpensesDto.id)
        page.expectedExpenses = expectedExpensesDto.expectedExpenses
        pageRepository.save(page)
    }
}