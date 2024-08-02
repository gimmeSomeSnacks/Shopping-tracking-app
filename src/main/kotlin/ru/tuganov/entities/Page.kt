package ru.tuganov.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "pages")
data class Page (
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    val user: User,
    @OneToMany(mappedBy = "page", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonIgnore
    val checkList: MutableList<Check>,
    @OneToMany(mappedBy = "page", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    val tagList: MutableList<Tag>,
    var pageName: String,
    var expectedExpenses: Int,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?=null
) {
}