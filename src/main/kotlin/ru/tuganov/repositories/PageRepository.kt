package ru.tuganov.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import ru.tuganov.entities.Page
import ru.tuganov.entities.User

@Repository
interface PageRepository: JpaRepository<Page, Int> {
    fun findAllByUser(user: User): List<Page>
    fun findPageById(pageId: Int): Page
}