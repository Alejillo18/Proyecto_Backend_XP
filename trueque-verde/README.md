# Trueque Verde 🌱

Backend de una plataforma para que vecinos intercambien plantas, esquejes y semillas sin usar dinero. Proyecto académico que aplica **Extreme Programming (XP)** con **BDD (Cucumber)** sobre **TypeScript**.

## Equipo (4 integrantes, 4 historias c/u)

| Integrante | Área | Historias |
|---|---|---|
| Persona 1 | Publicaciones | HU-01 a HU-04 |
| Persona 2 | Usuarios y perfil | HU-05 a HU-08 |
| Persona 3 | Intercambios y mensajería | HU-09 a HU-12 |
| Persona 4 | No funcionales / técnicas | HU-13 a HU-16 |

Ver el detalle completo de historias y criterios de aceptación en [`BACKLOG.md`](./BACKLOG.md).

Ver el detalle punto por punto de cómo se aplicó cada práctica de XP (con evidencia real de RED/GREEN/REFACTOR) en [`FASE_3_XP.md`](./FASE_3_XP.md).

> **Sprint 1** (implementado en este repo): HU-05, HU-01, HU-02, HU-03, HU-09, HU-10.
> El resto queda en el backlog para sprints siguientes siguiendo el mismo ciclo BDD/TDD.

## Cómo levantar el entorno

```bash
npm install
npm run dev
```

El servidor levanta en `http://localhost:3000`.

## Cómo correr los tests

```bash
npm run test:unit   # Jest (pruebas unitarias de servicios)
npm run test:e2e    # Cucumber (escenarios Gherkin de features/)
npm test            # ambas suites
```

## Estructura del repositorio

```
features/                     # Escenarios Gherkin (BDD)
src/
  controllers/                 # Capa de enrutamiento (Express)
  services/                    # Lógica de negocio (casos de uso)
  repositories/                # Acceso a datos (en memoria)
  models/                      # Tipos de dominio
tests/step_definitions/        # Steps de Cucumber en TypeScript
.github/workflows/main.yml     # Pipeline de CI
BACKLOG.md                     # Historias de usuario + criterios de aceptación
```

## Decisiones de diseño basadas en XP

- **Ciclo Red-Green-Refactor**: cada historia del Sprint 1 se escribió primero como escenario `.feature` (RED, sin lógica implementada), luego se implementó el servicio mínimo para pasarlo (GREEN), y finalmente se separaron responsabilidades en controller/service/repository (REFACTOR).
- **Diseño simple (YAGNI)**: los repositorios son en memoria (`Map`); se puede migrar a Prisma/TypeORM sin tocar los servicios, porque exponen la misma interfaz. No se agregó autenticación con JWT, colas de mensajería ni base de datos real porque el alcance actual no lo requiere.
- **Propiedad colectiva del código**: todos los servicios están desacoplados (inyección de dependencias manual en `src/app.ts`), por lo que cualquier integrante puede tocar cualquier capa sin pisarse con otro.
- **Integración continua**: el pipeline (`.github/workflows/main.yml`) corre lint, `tsc` y ambas suites de test en cada push/PR a `main`, para detectar errores lo antes posible (feedback rápido, un valor central de XP).
- **Seguridad desde el diseño (HU-14)**: las contraseñas nunca se guardan en texto plano; se hashean con `bcrypt` (10 salt rounds) antes de persistirse.
- **Privacidad (HU-16)**: el modelo `User` solo almacena `barrio`, nunca dirección exacta ni coordenadas.

## Próximos pasos (sprints siguientes)

- Implementar HU-02, HU-04, HU-06 a HU-08, HU-11, HU-12, HU-13, HU-15, HU-16 con el mismo ciclo BDD/TDD.
- Reemplazar los repositorios en memoria por PostgreSQL + Prisma cuando el equipo lo priorice.
- Agregar autenticación real (JWT) en las rutas protegidas.
