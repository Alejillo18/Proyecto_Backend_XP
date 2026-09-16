# HU-03: Buscar plantas por nombre
Feature: Buscar plantas
  Como usuario
  Quiero buscar plantas por nombre o categoría
  Para encontrar rápido lo que necesito

  Scenario: Búsqueda con coincidencias
    Given existen publicaciones de "Potus", "Suculenta" y "Lavanda"
    When busco plantas con el texto "suc"
    Then el resultado debe incluir la publicación "Suculenta"
    And el resultado no debe incluir la publicación "Potus"

  Scenario: Búsqueda sin resultados
    Given existen publicaciones de "Potus", "Suculenta" y "Lavanda"
    When busco plantas con el texto "cactus"
    Then debo ver el mensaje "No se encontraron plantas"
