package ru.tuganov.entities

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "checks")
data class Check (
    @ManyToOne
    val page: Page,
    var description: String,
    var expense: Int,
    @OneToOne
    var tag: Tag,
    val date: LocalDate,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?=null
) {
}