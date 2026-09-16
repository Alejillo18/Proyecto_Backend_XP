# HU-10: Aceptar o rechazar propuesta
Feature: Responder a una propuesta de intercambio
  Como usuario
  Quiero aceptar o rechazar una propuesta de intercambio
  Para decidir si se concreta el trueque

  Scenario: Aceptar una propuesta reserva ambas publicaciones
    Given "Maria" propuso intercambiar su "Lavanda" por el "Potus" de "Juan"
    When "Juan" acepta la propuesta
    Then el estado de la publicación "Potus" debe ser "Reservado"
    And el estado de la publicación "Lavanda" debe ser "Reservado"

  Scenario: Rechazar una propuesta notifica al proponente
    Given "Maria" propuso intercambiar su "Lavanda" por el "Potus" de "Juan"
    When "Juan" rechaza la propuesta
    Then el estado de la propuesta debe ser "Rechazada"
    And "Maria" debe recibir una notificación del rechazo
