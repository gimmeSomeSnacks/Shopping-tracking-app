package ru.tuganov.services

import org.springframework.stereotype.Service
import ru.tuganov.entities.Tag
import ru.tuganov.entities.dto.TagDto
import ru.tuganov.repositories.TagRepository

@Service
class TagService (
    private val tagRepository: TagRepository,
    private val pageService: PageService
){
    fun addNewTag(pageId: Int): Int {
        val tag = Tag(
            pageService.findPageById(pageId),
            "",
            mutableListOf()
        )
        tagRepository.save(tag)

        val page = pageService.findPageById(pageId)
        page.tagList.add(tag)
        pageService.save(page)

        return tag.id as Int
    }

    fun deleteTag(tagId: Int) {
        tagRepository.deleteById(tagId)
    }

    fun editTag(tagDto: TagDto) {
        val tag = tagRepository.findTagById(tagDto.id) as Tag
        tag.name = tagDto.name
        tagRepository.save(tag)
    }

    fun findTagById(id: Int): Tag? {
        return tagRepository.findTagById(id)
    }
}