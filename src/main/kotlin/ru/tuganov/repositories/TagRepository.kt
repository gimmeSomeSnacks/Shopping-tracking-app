package ru.tuganov.repositories

import org.springframework.data.jpa.repository.JpaRepository
import ru.tuganov.entities.Tag

interface TagRepository: JpaRepository<Tag, Int> {
    fun findTagById(id: Int): Tag?
}