package ru.tuganov.security

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class CookieProvider {
    fun getTokenFromCookies(request: HttpServletRequest, cookieName: String): String? {
        request.cookies?.let { cookies ->
            for (cookie in cookies) {
                if (cookieName == cookie.name) {
                    return cookie.value
                }
            }
        }
        return null
    }

    fun setTokenToCookies(response: HttpServletResponse, cookieName: String, cookieValue: String, expiration: Int) {
        val cookie = Cookie(cookieName, cookieValue)
        cookie.path = "/"
        cookie.maxAge = expiration
        cookie.isHttpOnly = true
        cookie.secure = false
        response.addCookie(cookie)
    }

    fun deleteCookies(response: HttpServletResponse, cookieName: String) {
        val cookie = Cookie(cookieName, null)
        cookie.path = "/"
        cookie.isHttpOnly = true
        cookie.maxAge = 0
        response.addCookie(cookie)
    }
}