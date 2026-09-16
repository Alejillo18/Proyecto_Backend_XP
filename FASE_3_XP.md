# Fase 3 — Desarrollo Backend y Prácticas XP (detalle)

Este documento explica, punto por punto, cómo se aplicó cada práctica de XP pedida en la consigna, con evidencia concreta tomada del propio repositorio (no es solo teoría: cada paso se ejecutó y se muestra el resultado real).

---

## 3.1 Prácticas XP

### 1. Desarrollo Guiado por Pruebas (TDD/BDD)

Se siguió estrictamente el ciclo **RED → GREEN → REFACTOR** para cada historia. Como ejemplo documentado, así se implementó **HU-02 (Editar/eliminar publicaciones)**:

**Paso 1 — RED: se escribe el `.feature` antes que cualquier código de negocio**

Archivo `features/editar_eliminar_publicacion.feature`:
```gherkin
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
```

Al correr `npm run test:e2e` en este punto (sin step definitions ni método `delete` en el servicio), Cucumber reporta:

```
? And "Maria" está registrada
    Undefined. Implement with the following snippet:
      Given('{string} está registrada', function (string) { ... });

? When "Maria" intenta eliminar la publicación "Potus"
    Undefined. Implement with the following snippet: ...

14 scenarios (2 undefined, 12 passed)
52 steps (6 undefined, 46 passed)
```

Esto es la **prueba fallando** (en Cucumber, "undefined" cuenta como fallo: el escenario no puede confirmarse como correcto). Recién ahí se empieza a escribir código de producción.

**Paso 2 — GREEN: código mínimo para pasar la prueba**

Se agregó el método `delete` en `PublicationService`:
```typescript
delete(publicationId: string, requesterId: string): void {
  const publication = this.publicationRepository.findById(publicationId);
  if (!publication) {
    throw new ValidationError('La publicación no existe');
  }
  if (publication.ownerId !== requesterId) {
    throw new ValidationError('No podés eliminar una publicación que no es tuya');
  }
  this.publicationRepository.delete(publicationId);
}
```
y los step definitions correspondientes en `tests/step_definitions/eliminar_publicacion.steps.ts`. Al volver a correr `npm run test:e2e`:
```
14 scenarios (14 passed)
52 steps (52 passed)
```

**Paso 3 — REFACTOR: mejorar el código sin cambiar el comportamiento**

Una vez en verde, se notó que la validación "existe / soy el dueño" se iba a repetir cuando se implemente **editar** (misma historia HU-02). Se extrajo a un método privado:

```typescript
private getOwnedPublicationOrThrow(
  publicationId: string,
  requesterId: string,
  action: 'editar' | 'eliminar'
): Publication {
  const publication = this.publicationRepository.findById(publicationId);
  if (!publication) throw new ValidationError('La publicación no existe');
  if (publication.ownerId !== requesterId) {
    throw new ValidationError(`No podés ${action} una publicación que no es tuya`);
  }
  return publication;
}
```

Se corrió de nuevo toda la suite (`build`, `test:unit`, `test:e2e`) y todo siguió en verde — confirmando que el refactor no rompió nada:
```
14 scenarios (14 passed)
Tests: 5 passed, 5 total
```

Este mismo ciclo (RED → GREEN → REFACTOR) es el que el equipo debe repetir para cada historia pendiente del backlog (HU-04, HU-06 a HU-08, HU-11 a HU-16). **Regla de oro: si vas a tocar `src/`, primero tiene que existir un escenario en `features/` que falle.**

---

### 2. Diseño Simple (YAGNI)

Decisiones tomadas para no sobre-diseñar, justificadas por lo que las pruebas realmente exigen hoy:

| Se necesitaba | Se implementó | Lo que NO se hizo (todavía) | Por qué |
|---|---|---|---|
| Guardar usuarios/publicaciones | `Map` en memoria (`InMemoryRepositories.ts`) | Base de datos real con ORM | Los tests de Cucumber no requieren persistencia entre ejecuciones; se puede migrar después sin tocar los servicios porque respetan la misma interfaz. |
| Saber quién puede borrar una publicación | Comparar `ownerId === requesterId` | Sistema de roles/permisos genérico | Ninguna historia actual pide roles (admin, moderador, etc.). Agregar eso ahora sería especular sobre necesidades futuras. |
| Avisar al dueño de una propuesta | `NotificationService` en memoria con un array | Integración con email/push/WebSockets | HU-09/HU-10 solo piden "debe recibir una notificación", no un canal específico. |
| Login | Comparar hash con `bcrypt.compare` | JWT / sesiones / refresh tokens | Ninguna historia del Sprint 1 pide mantener sesión entre requests. |

La regla aplicada: **implementar lo mínimo que hace pasar el escenario actual**, y refactorizar/extender solo cuando una nueva historia lo exija (no antes).

---

### 3. Refactorización Continua

Además del ejemplo de HU-02 de arriba, la arquitectura general ya refleja refactors previos:
- La lógica de "no podés proponer intercambio sobre tu propia publicación" vive en `ExchangeService`, no en el controlador — se movió ahí para poder testearla también con Jest sin pasar por HTTP.
- Los controladores (`UserController`, `PublicationController`, `ExchangeController`) son finos: solo traducen HTTP ↔ llamada a servicio ↔ código de estado. Toda regla de negocio vive en `services/`.

**Checklist de refactor que usa el equipo después de cada GREEN:**
1. ¿Hay lógica duplicada entre dos métodos? → extraer método privado.
2. ¿El controlador tiene un `if` de negocio (no de HTTP)? → moverlo al servicio.
3. ¿Correr `npm test` sigue en verde después del cambio? Si no, el refactor está mal hecho.

---

### 4. Integración Continua (CI)

Pipeline en `.github/workflows/main.yml`, disparado en cada `push` y `pull_request` a `main`:

```yaml
jobs:
  build-and-test:
    steps:
      - actions/checkout@v4
      - actions/setup-node@v4 (Node 20)
      - npm ci
      - npm run lint        # ESLint
      - npm run build       # tsc (falla si hay errores de tipos)
      - npm run test:unit   # Jest
      - npm run test:e2e    # Cucumber
```

**Qué detecta cada paso, y por qué el orden importa** (falla rápido primero, lo más barato):
1. `lint` — errores de estilo y código muerto. Es lo más rápido de correr.
2. `build` (`tsc`) — con `strict: true`, si alguien rompe un tipo, el pipeline falla acá antes de perder tiempo corriendo tests.
3. `test:unit` (Jest) — lógica de servicios aislada (ej. hashing de contraseñas).
4. `test:e2e` (Cucumber) — comportamiento de negocio de punta a punta, el que realmente valida las Historias de Usuario.

Si cualquiera de los 4 pasos falla, el pipeline se marca en rojo y el PR no debería mergearse — esto fuerza al equipo a mantener siempre una rama `main` funcionando, otro valor central de XP (integración continua = "feedback rápido").

---

## 3.2 Restricciones Técnicas — cómo se cumplen

**TypeScript strict mode**: activado en `tsconfig.json` (`"strict": true`). Se verificó que el proyecto compila sin errores (`npm run build`).

**Persistencia**: repositorio en memoria (`src/repositories/InMemoryRepositories.ts`), cumpliendo la opción permitida por la consigna. Migración futura a Prisma/PostgreSQL no requeriría cambios en `services/` ni `controllers/`, solo una nueva implementación de las mismas interfaces.

**Arquitectura en capas**, estrictamente separada:

```
HTTP request
     │
     ▼
controllers/   →  solo traduce HTTP: lee req, llama al service, arma la respuesta
     │
     ▼
services/      →  toda la lógica de negocio (reglas, validaciones, orquestación)
     │
     ▼
repositories/  →  acceso a datos (hoy: Map en memoria; mañana: ORM)
```

Ningún controlador accede directamente a un repositorio, y ningún repositorio conoce reglas de negocio — así se puede testear cada capa por separado (los tests de `UserService` con Jest no levantan Express, y los steps de Cucumber tampoco hacen peticiones HTTP reales, usan los servicios directamente a través del `AppContainer`).

---

## Cómo reproducir esta evidencia ustedes mismos

```bash
npm install

# 1) Ver el RED: comentar o borrar temporalmente el método delete()
#    de PublicationService y correr:
npm run test:e2e   # va a mostrar "undefined steps" o fallos de aserción

# 2) Restaurar el código -> GREEN
npm run test:e2e   # 14 scenarios (14 passed)

# 3) Pipeline completo, como lo corre GitHub Actions
npm run lint && npm run build && npm run test:unit && npm run test:e2e
```
