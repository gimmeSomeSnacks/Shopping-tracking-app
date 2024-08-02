package ru.tuganov.entities

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import ru.tuganov.security.Role

@Entity
@Table(name = "users")
data class User(
    private var username: String,
    private var password: String,
    var email: String,
    @Enumerated(EnumType.STRING)
    val role: Role,
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    val pageList: List<Page> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    val id: Long? = 0
): UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = mutableListOf(SimpleGrantedAuthority(role.name))

    override fun getPassword(): String = password

    override fun getUsername(): String = username
}