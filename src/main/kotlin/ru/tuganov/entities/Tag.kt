package ru.tuganov.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
data class Tag (
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    val page: Page,
    var name: String,
    @OneToMany(mappedBy = "tag", fetch = FetchType.LAZY,)
    @JsonIgnore
    var checkList: MutableList<Check>,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?=null
) {
}