package ru.tuganov.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Tag (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private val id: Int,
    private val name: String
) {
}