package ru.tuganov.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.tuganov.entities.Page
import ru.tuganov.entities.User
import ru.tuganov.entities.dto.FindCheckDto
import ru.tuganov.entities.dto.PageDto
import ru.tuganov.repositories.PageRepository

@Service
class CheckService @Autowired constructor(
    private val userService: UserService,
    private val pageRepository: PageRepository
) {

    fun findChecksByPageIdAndDate(findCheckDto: FindCheckDto): Page{
        return pageRepository.findPageById(findCheckDto.getPageId())
    }

    fun findPages(): List<Page> {
        val currentUser = userService.currentUser() as User
        return pageRepository.findAllByUser(currentUser)
    }

    fun savePage(pageDto: PageDto) {
        val page = Page(
            (userService.currentUser() as User),
            pageDto.getChecks(),
            pageDto.getTagList(),
            pageDto.getPageName(),
            pageDto.getExpectedExpenses()
        )
        pageRepository.save(page)
    }
}