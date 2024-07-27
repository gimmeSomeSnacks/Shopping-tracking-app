package ru.tuganov

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ShoppingTrackingAppApplication

fun main(args: Array<String>) {
    runApplication<ShoppingTrackingAppApplication>(*args)
}
