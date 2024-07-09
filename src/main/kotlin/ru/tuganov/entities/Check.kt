package ru.tuganov.entities

import jakarta.persistence.*

@Entity
@Table(name = "checks")
data class Check (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private val id: Long = 0,
    @ManyToOne
    private val user: User
) {
}