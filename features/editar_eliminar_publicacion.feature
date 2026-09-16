# HU-02: Editar o eliminar publicaciones propias
Feature: Editar o eliminar publicaciones
  Como usuario
  Quiero editar o eliminar mis publicaciones
  Para mantener actualizada mi oferta

  Scenario: El dueño puede eliminar su publicación
    Given "Juan" publicó la planta "Potus"
    When "Juan" elimina la publicación "Potus"
    Then la publicación "Potus" no debe existir más

  Scenario: Un usuario distinto no puede eliminar la publicación de otro
    Given "Juan" publicó la planta "Potus"
    And "Maria" está registrada
    When "Maria" intenta eliminar la publicación "Potus"
    Then la eliminación debe fallar con el error "No podés eliminar una publicación que no es tuya"
    And la publicación "Potus" debe seguir existiendo
