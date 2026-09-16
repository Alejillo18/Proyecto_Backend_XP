# HU-09: Proponer intercambio
Feature: Proponer intercambio
  Como usuario
  Quiero proponer un intercambio sobre una publicación ofreciendo una de mis plantas
  Para negociar el trueque

  Scenario: Propuesta exitosa de intercambio
    Given "Juan" publicó la planta "Potus"
    And "Maria" publicó la planta "Lavanda"
    When "Maria" propone intercambiar su "Lavanda" por el "Potus" de "Juan"
    Then la propuesta debe crearse con estado "Pendiente"
    And "Juan" debe recibir una notificación de la propuesta

  Scenario: No se puede proponer intercambio sobre la propia publicación
    Given "Juan" publicó la planta "Potus"
    When "Juan" intenta proponer un intercambio sobre su propio "Potus"
    Then la propuesta debe fallar con el error "No podés proponer un intercambio sobre tu propia publicación"
