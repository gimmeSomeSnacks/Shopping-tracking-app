package ru.tuganov.entities

import jakarta.persistence.*

@Entity
@Table(name = "pages")
data class Page (
    @ManyToOne(fetch = FetchType.LAZY)
    val user: User,
    @OneToMany(fetch = FetchType.LAZY)
    val checkList: MutableList<Check>,
    @OneToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    val tagList: List<Tag>,
    var pageName: String,
    var expectedExpenses: Int,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?=null
) {
}