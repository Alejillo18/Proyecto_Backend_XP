Testing (BDD + TDD) — Trueque Verde

Este documento resume el trabajo de testing que hice en el proyecto: la suite de pruebas BDD con Cucumber, las pruebas unitarias con Jest, y el proceso que seguí para encontrar y corregir un bug real siguiendo el ciclo TDD/BDD de XP.

Qué hice
Escribí los archivos .feature en Gherkin para las historias de usuario del Sprint 1.
Implementé los step definitions en TypeScript que conectan esos escenarios con el código real (no con mocks).
Escribí pruebas unitarias con Jest para la lógica de autenticación.
Audité los criterios de aceptación de las historias contra la cobertura real de tests, documenté los gaps, y cerré uno de ellos (ver sección "Bug encontrado y corregido").
Dejé todo integrado en el pipeline de CI para que corra automáticamente en cada push.
Herramientas usadas
Cucumber.js (@cucumber/cucumber) + ts-node para correr los escenarios Gherkin directamente en TypeScript.
Jest + ts-jest para las pruebas unitarias.
bcrypt como dependencia probada en las pruebas de seguridad de contraseñas.
Archivos de testing que escribí
Features (BDD)
Archivo	Historia	Escenarios
features/registro_usuario.feature	HU-05	3
features/publicar_planta.feature	HU-01	3
features/editar_eliminar_publicacion.feature	HU-02	2
features/buscar_planta.feature	HU-03	2
features/proponer_intercambio.feature	HU-09	2
features/responder_intercambio.feature	HU-10	3

Total: 15 escenarios.

Step definitions

Un archivo de steps por cada feature, más un world.ts compartido:

tests/step_definitions/world.ts — el World personalizado de Cucumber. Crea una instancia nueva de la app (createApp()) en cada escenario para que no haya estado compartido entre tests, y guarda mapas auxiliares (usersByName, publicationsByPlant, lastError, etc.) para pasar datos entre los pasos Given/When/Then.
tests/step_definitions/registro_usuario.steps.ts
tests/step_definitions/publicar_planta.steps.ts
tests/step_definitions/eliminar_publicacion.steps.ts
tests/step_definitions/buscar_planta.steps.ts
tests/step_definitions/proponer_intercambio.steps.ts
tests/step_definitions/responder_intercambio.steps.ts
Unitarios (Jest)
src/services/UserService.test.ts — 5 tests: registro válido, contraseña corta rechazada, email duplicado rechazado, login correcto, login con contraseña incorrecta. Verifica en particular que la contraseña nunca se guarda en texto plano (HU-14).
Cómo corrí (y cómo se corre) la suite
bash
npm install
npm run test:unit   # Jest
npm run test:e2e    # Cucumber
npm test             # ambas, en ese orden

Resultado actual:

Jest:     5 passed, 5 total
Cucumber: 15 scenarios (15 passed), 58 steps (58 passed)
Bug encontrado y corregido (ciclo TDD real)

Al revisar los criterios de aceptación de HU-10 contra lo que ya estaba implementado, noté que faltaba cubrir: "sobre una publicación ya reservada no se pueden aceptar nuevas propuestas". El código permitía aceptar una segunda propuesta sobre algo que ya estaba reservado — un bug real, no solo un hueco de test.

Seguí el ciclo completo:

1. RED — agregué el escenario antes de tocar el código de negocio:

gherkin
Scenario: No se puede aceptar una nueva propuesta sobre una publicación ya reservada
  Given "Maria" propuso intercambiar su "Lavanda" por el "Potus" de "Juan"
  And "Juan" acepta la propuesta
  And "Pedro" publicó la planta "Jazmín"
  And "Pedro" propone intercambiar su "Jazmín" por el "Potus" de "Juan"
  When "Juan" intenta aceptar la nueva propuesta sobre "Potus"
  Then la aceptación debe fallar con el error "La publicación ya está reservada"

Al correr npm run test:e2e, Cucumber marcó los pasos nuevos como undefined (14 scenarios pasando, 1 sin implementar).

2. GREEN — agregué la validación mínima en ExchangeService.accept():

typescript
accept(offerId: string): ExchangeOffer {
  const offer = this.getOfferOrThrow(offerId);

  const targetPublication = this.publicationRepository.findById(offer.targetPublicationId);
  if (targetPublication?.status === 'Reservado') {
    throw new ValidationError('La publicación ya está reservada');
  }

  offer.status = 'Aceptada';
  // ...
}

y los step definitions correspondientes. Resultado: 15/15 escenarios en verde.

3. REFACTOR — volví a correr toda la suite (build, test:unit, test:e2e) para confirmar que el cambio no rompió nada existente. Todo siguió en verde.

Estado de cobertura por historia (auditoría que hice)

No todas las historias que me pasó mi compañero tienen cobertura completa. Documenté esto en detalle en TESTING.md, pero el resumen es:

Historia	Estado
HU-05 (registro)	✅ Cobertura completa
HU-10 (aceptar/rechazar)	✅ Cobertura completa (después del fix de arriba)
HU-03 (buscar)	⚠️ Parcial — falta escenario de búsqueda + filtro de barrio combinados
HU-09 (proponer)	⚠️ Parcial — el campo "mensaje opcional" ni siquiera existe en el modelo
HU-13 (performance)	❌ Sin test — necesita herramienta de load testing, no Cucumber/Jest
HU-14 (bcrypt)	⚠️ Parcial — se testea que no es texto plano, pero no el número exacto de salt rounds
HU-15 (CI)	✅ Se autoverifica corriendo el pipeline en GitHub Actions
HU-16 (privacidad)	⚠️ Cierto por diseño (el modelo no tiene campo de coordenadas) pero sin test que lo blinde a futuro
