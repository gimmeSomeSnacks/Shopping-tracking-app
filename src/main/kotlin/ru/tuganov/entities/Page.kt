package ru.tuganov.entities

import jakarta.persistence.*

@Entity
@Table(name = "pages")
data class Page (
    @ManyToOne(fetch = FetchType.LAZY)
    private val user: User,
    @OneToMany(fetch = FetchType.LAZY)
    private val checkList: List<Check>,
    @OneToMany(fetch = FetchType.LAZY)
    private val tagList: List<Tag>,
    private val pageName: String,
    private val expectedExpenses: Int
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private val id: Long = 0
}