# Backlog del Producto — Trueque Verde

Plataforma para que vecinos intercambien plantas, esquejes y semillas sin usar dinero.

Repartición del equipo: 4 integrantes, 4 historias funcionales/técnicas cada uno.

---

## Persona 1 — Publicaciones

### HU-01: Publicar una planta
**Como** usuario, **quiero** publicar una planta/esqueje que ofrezco, con foto y descripción, **para** que otros vecinos la vean.

**Criterios de aceptación:**
- Dado que completo nombre, foto y barrio, la publicación queda visible en el listado.
- Si falta la foto, el sistema muestra un ícono genérico pero permite publicar igual.
- No se puede publicar sin nombre de la planta (campo obligatorio).

### HU-02: Editar o eliminar publicaciones propias
**Como** usuario, **quiero** editar o eliminar mis publicaciones, **para** mantener actualizada mi oferta.

**Criterios de aceptación:**
- Solo el dueño de la publicación puede editarla o borrarla.
- Al eliminar, se pide confirmación antes de borrar definitivamente.
- Un usuario que no es el dueño recibe error 403 al intentar editar/borrar.

### HU-03: Buscar plantas por nombre
**Como** usuario, **quiero** buscar plantas por nombre o categoría, **para** encontrar rápido lo que necesito.

**Criterios de aceptación:**
- La búsqueda devuelve resultados que coincidan parcialmente (case-insensitive) con el texto ingresado.
- Si no hay resultados, se muestra un mensaje claro ("No se encontraron plantas").

### HU-04: Filtrar publicaciones por barrio
**Como** usuario, **quiero** filtrar publicaciones por zona/barrio, **para** intercambiar con vecinos cercanos.

**Criterios de aceptación:**
- El filtro muestra solo publicaciones del barrio seleccionado.
- Puedo combinar el filtro de zona con la búsqueda por nombre.

---

## Persona 2 — Usuarios y perfil

### HU-05: Registro de usuario
**Como** visitante, **quiero** registrarme con email y contraseña, **para** poder publicar e intercambiar.

**Criterios de aceptación:**
- La contraseña debe tener mínimo 8 caracteres.
- Si el email ya está registrado, se muestra un error claro (409).

### HU-06: Inicio de sesión
**Como** usuario registrado, **quiero** iniciar sesión, **para** acceder a mi cuenta y publicaciones.

**Criterios de aceptación:**
- Con credenciales correctas, recibo un token de sesión válido.
- Con credenciales incorrectas, se muestra un mensaje de error genérico (no se indica cuál dato falló).

### HU-07: Perfil de usuario
**Como** usuario, **quiero** tener un perfil con mis datos y mis publicaciones activas, **para** que otros vecinos me conozcan.

**Criterios de aceptación:**
- El perfil muestra nombre, barrio y cantidad de intercambios realizados.
- Puedo editar mi nombre y barrio desde el perfil.

### HU-08: Historial de intercambios
**Como** usuario, **quiero** ver el historial de intercambios que realicé, **para** llevar un registro de mi actividad.

**Criterios de aceptación:**
- El historial lista fecha, planta intercambiada y con quién.
- Los intercambios se ordenan del más reciente al más antiguo.

---

## Persona 3 — Intercambios y mensajería

### HU-09: Proponer intercambio
**Como** usuario, **quiero** proponer un intercambio sobre una publicación, ofreciendo una de mis plantas a cambio, **para** negociar el trueque.

**Criterios de aceptación:**
- La propuesta incluye qué planta ofrezco y un mensaje opcional.
- El dueño de la publicación recibe una notificación de la propuesta.
- No puedo proponer un intercambio sobre mi propia publicación.

### HU-10: Aceptar o rechazar propuesta
**Como** usuario, **quiero** aceptar o rechazar una propuesta de intercambio, **para** decidir si se concreta el trueque.

**Criterios de aceptación:**
- Al aceptar, ambas publicaciones cambian su estado a "Reservado".
- Al rechazar, la propuesta queda marcada como "Rechazada" y el otro usuario es notificado.

### HU-11: Chat entre usuarios
**Como** usuario, **quiero** chatear con la otra persona una vez aceptado el intercambio, **para** coordinar el lugar y horario de encuentro.

**Criterios de aceptación:**
- El chat solo se habilita entre usuarios con un intercambio aceptado.
- Los mensajes se muestran en orden cronológico.

### HU-12: Completar intercambio
**Como** usuario, **quiero** marcar un intercambio como "completado", **para** cerrar la operación y liberar la publicación.

**Criterios de aceptación:**
- Ambas partes deben confirmar para que el intercambio quede como "Completado".
- Una vez completado, la publicación desaparece del listado activo.

---

## Persona 4 — Requisitos no funcionales / técnicos

### HU-13: Rendimiento de la API
**Como** administrador del sistema, **quiero** que los endpoints respondan en menos de 300ms, **para** garantizar una experiencia fluida.

**Criterios de aceptación:**
- El 95% de las peticiones bajo carga normal cumplen el límite.
- Se registra un log cuando una respuesta supera el umbral.

### HU-14: Seguridad de contraseñas
**Como** auditor de seguridad, **quiero** que las contraseñas se almacenen con hashing (bcrypt) y salting, **para** proteger los datos ante una brecha.

**Criterios de aceptación:**
- Ninguna contraseña se guarda en texto plano.
- El hash incluye salt único por usuario (bcrypt maneja esto internamente).

### HU-15: Integración Continua
**Como** desarrollador, **quiero** que el proyecto tenga un pipeline de CI que corra lint, build y tests en cada push, **para** detectar errores temprano.

**Criterios de aceptación:**
- El pipeline falla si el linter, el build o los tests no pasan.
- Se ejecuta automáticamente en cada push y pull request a la rama principal.

### HU-16: Privacidad de ubicación
**Como** usuario, **quiero** que mis datos de ubicación solo muestren el barrio y no la dirección exacta, **para** proteger mi privacidad.

**Criterios de aceptación:**
- Ningún endpoint expone dirección exacta, solo barrio/zona.
- El modelo de datos no almacena coordenadas exactas del usuario.

---

## Orden de implementación sugerido (Sprint 1)

Para arrancar el ciclo BDD/TDD de XP con algo acotado, el Sprint 1 cubre de punta a punta:
**HU-05 (registro) → HU-01 (publicar) → HU-03 (buscar) → HU-09 (proponer intercambio) → HU-10 (aceptar/rechazar)**.

El resto del backlog queda documentado para sprints siguientes, siguiendo el mismo ciclo Red-Green-Refactor.
