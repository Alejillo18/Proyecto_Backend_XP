# HU-05: Registro de usuario
Feature: Registro de usuario
  Como visitante
  Quiero registrarme con email y contraseña
  Para poder publicar e intercambiar plantas

  Scenario: Registro exitoso con datos válidos
    Given no existe ningún usuario con email "vecina@correo.com"
    When me registro con email "vecina@correo.com", contraseña "hojas1234" y barrio "Belgrano"
    Then el registro debe ser exitoso
    And el usuario "vecina@correo.com" debe existir en el sistema

  Scenario: Registro rechazado por email duplicado
    Given ya existe un usuario registrado con email "vecina@correo.com"
    When me registro con email "vecina@correo.com", contraseña "hojas1234" y barrio "Belgrano"
    Then el registro debe fallar con el error "El email ya está registrado"

  Scenario: Registro rechazado por contraseña corta
    Given no existe ningún usuario con email "nueva@correo.com"
    When me registro con email "nueva@correo.com", contraseña "123" y barrio "Palermo"
    Then el registro debe fallar con el error "La contraseña debe tener al menos 8 caracteres"
