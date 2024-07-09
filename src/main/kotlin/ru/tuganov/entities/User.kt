package ru.tuganov.entities

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import ru.tuganov.security.Role

@Entity
@Table(name = "users")
data class User(
    private val username: String,
    private val password: String,
    private val email: String,
    @Enumerated(EnumType.STRING)
    private val role: Role,
): UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private val id: Long = 0
    @OneToMany
    private val checkList: List<Check> = emptyList()

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = mutableListOf(SimpleGrantedAuthority(role.name))

    override fun getPassword(): String = password

    override fun getUsername(): String = username

    fun getId(): Long = id
}