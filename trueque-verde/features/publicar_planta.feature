# HU-01: Publicar una planta
Feature: Publicar una planta
  Como usuario registrado
  Quiero publicar una planta o esqueje que ofrezco
  Para que otros vecinos la vean

  Scenario: Publicación exitosa con todos los datos
    Given el usuario "Juan" está registrado con barrio "Belgrano"
    When "Juan" publica la planta "Potus" con foto "potus.jpg" en el barrio "Belgrano"
    Then la publicación de "Potus" debe estar visible en el listado
    And el estado de la publicación debe ser "Disponible"

  Scenario: Publicación exitosa sin foto usa ícono genérico
    Given el usuario "Juan" está registrado con barrio "Belgrano"
    When "Juan" publica la planta "Suculenta" sin foto en el barrio "Belgrano"
    Then la publicación de "Suculenta" debe estar visible en el listado
    And la publicación de "Suculenta" debe mostrar el ícono genérico

  Scenario: Publicación rechazada sin nombre de planta
    Given el usuario "Juan" está registrado con barrio "Belgrano"
    When "Juan" intenta publicar una planta sin nombre en el barrio "Belgrano"
    Then la publicación debe fallar con el error "El nombre de la planta es obligatorio"
