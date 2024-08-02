package ru.tuganov.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "checks")
data class Check (
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    val page: Page,
    var description: String,
    var expense: Int,
    val date: LocalDate,
    @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var tag: Tag?=null,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?=null
) {
}