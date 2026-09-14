# Requisitos del Sistema — Trueque Verde 🌱

Plataforma para que vecinos intercambien plantas, esquejes y semillas sin usar dinero. Backend en TypeScript con Express, BDD (Cucumber) y Jest.

---

## 1.1 Requisitos Funcionales

### HU-01: Publicar una planta
**Como** usuario registrado, **quiero** publicar una planta, esqueje o semilla que ofrezco, con foto y descripción, **para** que otros vecinos la vean y pueda realizar trueques.

**Criterios de aceptación:**
- Dado que completo nombre, foto y barrio, la publicación queda visible en el listado con estado "Disponible".
- Si falta la foto, el sistema muestra un ícono genérico pero permite publicar igual.
- No se puede publicar sin nombre de planta; el sistema rechaza la operación con el error "El nombre de la planta es obligatorio".

### HU-02: Editar o eliminar publicaciones propias
**Como** usuario, **quiero** editar o eliminar mis publicaciones, **para** mantener actualizada mi oferta cuando la planta ya no está disponible o cambió.

**Criterios de aceptación:**
- Solo el dueño de la publicación puede editarla o eliminarla.
- Al eliminar, el sistema pide confirmación antes de borrar definitivamente.
- Un usuario que no es el dueño recibe un error 403/ValidationError al intentar editar o borrar, y la publicación sigue existiendo.

### HU-03: Buscar plantas por nombre
**Como** usuario, **quiero** buscar plantas por nombre o categoría, **para** encontrar rápido lo que necesito sin recorrer todo el listado.

**Criterios de aceptación:**
- La búsqueda devuelve resultados que coincidan parcialmente (case-insensitive) con el texto ingresado.
- Si no hay resultados, se muestra el mensaje "No se encontraron plantas".
- La búsqueda se puede combinar con el filtro por barrio.

### HU-05: Registro de usuario
**Como** visitante, **quiero** registrarme con email y contraseña, **para** poder publicar proponer y aceptar intercambios.

**Criterios de aceptación:**
- La contraseña debe tener mínimo 8 caracteres; si no, el registro se rechaza con un error claro.
- Si el email ya está registrado, se muestra el error "El email ya está registrado" (HTTP 409).
- Con datos válidos, el registro es exitoso y el usuario queda persistido en el sistema.

### HU-09: Proponer intercambio
**Como** usuario, **quiero** proponer un intercambio sobre una publicación ofreciendo una de mis plantas a cambio, **para** negociar el trueque.

**Criterios de aceptación:**
- La propuesta incluye qué planta ofrezco y un mensaje opcional.
- El dueño de la publicación recibe una notificación de la propuesta.
- No puedo proponer un intercambio sobre mi propia publicación; el sistema lo rechaza.

### HU-10: Aceptar o rechazar propuesta
**Como** usuario, **quiero** aceptar o rechazar una propuesta de intercambio, **para** decidir si se concreta el trueque.

**Criterios de aceptación:**
- Al aceptar, ambas publicaciones cambian su estado a "Reservado".
- Al rechazar, la propuesta queda marcada como "Rechazada" y el otro usuario es notificado.
- Sobre una publicación ya reservada no se pueden aceptar nuevas propuestas.

---

## 1.2 Requisitos No Funcionales

### HU-13: Rendimiento de la API
**Como** administrador del sistema, **quiero** que los endpoints de la API respondan en menos de 300ms, **para** garantizar una experiencia fluida bajo concurrencia.

**Criterios de aceptación:**
- El 95% de las peticiones bajo carga normal cumplen el límite de 300ms.
- Se registra un log de advertencia cuando una respuesta supera el umbral.

### HU-14: Seguridad de contraseñas
**Como** auditor de seguridad, **quiero** que todas las contraseñas se almacenen usando hashing con bcrypt y salting, **para** proteger los datos en caso de una brecha.

**Criterios de aceptación:**
- Ninguna contraseña se guarda en texto plano en la persistencia.
- El hash incluye un salt único por usuario (bcrypt lo maneja internamente con 10 salt rounds).
- El login valida la contraseña comparando el hash con `bcrypt.compare`, nunca leyendo la contraseña original.

### HU-15: Integración continua
**Como** desarrollador, **quiero** que el proyecto tenga un pipeline de CI que corra lint, build y tests en cada push, **para** detectar errores temprano y mantener `main` siempre funcionando.

**Criterios de aceptación:**
- El pipeline falla si el linter, el build (`tsc`) o alguna suite de tests no pasan.
- Se ejecuta automáticamente en cada push y pull request a la rama principal.

### HU-16: Privacidad de ubicación
**Como** usuario, **quiero** que mis datos de ubicación solo muestren el barrio y no la dirección exacta, **para** proteger mi privacidad y seguridad.

**Criterios de aceptación:**
- Ningún endpoint expone dirección exacta ni coordenadas, solo barrio/zona.
- El modelo de datos `User` no almacena dirección exacta ni coordenadas del usuario.