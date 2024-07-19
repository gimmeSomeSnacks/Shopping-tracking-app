package ru.tuganov.entities

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "checks")
data class Check (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private val id: Long,
    @ManyToOne
    private val page: Page,
    private val description: String,
    private val expense: Int,
    @OneToOne
    private val tag: Tag,
    private val date: LocalDate
) {
}