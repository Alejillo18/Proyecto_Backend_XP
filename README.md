# 🌱 Trueque Verde - Backend API

Plataforma para que vecinos intercambien plantas, esquejes y semillas sin usar dinero. Este proyecto backend está desarrollado en **TypeScript** con **Express**, aplicando rigurosamente valores y prácticas de **Extreme Programming (XP)** y **Behavior-Driven Development (BDD)**.

## Tecnologías

*   **Node.js & Express:** Framework web para la creación de la API REST.
*   **TypeScript:** Modo estricto activado para mayor seguridad de tipos.
*   **MongoDB & Mongoose:** Base de datos NoSQL y ODM para la persistencia de datos.
*   **JWT & Bcrypt:** Autenticación basada en JSON Web Tokens y hashing de contraseñas.
*   **Swagger:** Documentación interactiva de la API (`swagger-jsdoc` y `swagger-ui-express`).
*   **Cucumber:** Pruebas End-to-End y BDD utilizando sintaxis Gherkin.
*   **Jest:** Pruebas unitarias de los servicios.
*   **GitHub Actions:** Integración Continua (CI).

---

## Instrucciones de Ejecución

### 1. Instalación
Cloná el repositorio e instalá las dependencias requeridas:

```bash
git clone [https://github.com/Alejillo18/Proyecto_Backend_XP.git](https://github.com/Alejillo18/Proyecto_Backend_XP.git)
cd trueque-verde
npm install
```

### 2. Variables de Entorno
El proyecto requiere un archivo `.env` en la raíz para funcionar correctamente. Creá el archivo con la siguiente estructura:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/trueque-verde
JWT_SECRET=tu_secreto_super_seguro
```

### 3. Levantar el entorno de desarrollo
Para iniciar el servidor local con hot-reload (utilizando `ts-node-dev`), ejecutá:

```bash
npm run dev
```
El servidor confirmará la conexión a MongoDB y estará escuchando en el puerto configurado. Se reiniciará automáticamente ante cualquier cambio.

### 4. Compilar a producción (Build)
Para compilar el código TypeScript a JavaScript estricto:

```bash
npm run build
npm start
```

---

## Documentación de la API (Swagger)

Todos los endpoints de la API están documentados visualmente mediante Swagger. Desde la interfaz se pueden explorar los esquemas, ver los requerimientos y probar las rutas.

*   **Ruta de acceso:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
*   **Autenticación:** La API cuenta con rutas protegidas. Para acceder, utilizá el endpoint `POST /users/login` para obtener un token JWT, y configuralo en el botón **Authorize** ubicado en la parte superior de la documentación.

---

## Suite de Pruebas (TDD/BDD)

Este proyecto fue construido utilizando BDD como pilar fundamental. Las pruebas aseguran que la lógica de negocio cumple exactamente con lo esperado por las Historias de Usuario.

*   **Ejecutar toda la suite (Unitarias + BDD):**
    ```bash
    npm run test
    ```
*   **Ejecutar solo las pruebas de comportamiento (Cucumber):**
    ```bash
    npm run test:e2e
    ```
*   **Ejecutar solo pruebas unitarias (Jest):**
    ```bash
    npm run test:unit
    ```

---

## Decisiones de Diseño basadas en Extreme Programming (XP)

El desarrollo de la arquitectura y el código de este backend se guió estrictamente por las siguientes prácticas de XP:

1.  **Desarrollo Guiado por Pruebas (TDD/BDD):**
    *   Se definió el comportamiento del sistema mediante criterios de aceptación traducidos a sintaxis Gherkin (archivos `.feature`).
    *   El código de producción se escribió pasando siempre por una **Fase RED** (pruebas fallidas) hasta alcanzar el **GREEN**, asegurando que cada línea de código tenga un propósito validado.

2.  **Diseño Simple e Inyección de Dependencias (El éxito del patrón):**
    *   Fieles al principio YAGNI (*You Aren't Gonna Need It*), el desarrollo inicial se hizo con **Repositorios en Memoria** para validar rápido la lógica de negocio sin lidiar con infraestructura.
    *   Gracias a la **Inyección de Dependencias** y la separación en capas, la migración a **MongoDB/Mongoose** se logró creando nuevos repositorios e inyectándolos en el `AppContainer`, sin necesidad de modificar la lógica de los Servicios o Controladores.

3.  **Refactorización Continua:**
    *   Una vez que las pruebas pasaron a verde, el código fue refactorizado iterativamente. Se implementó asincronía (`async/await`) en todo el flujo, middlewares de seguridad para validar los JWT, y enrutadores dedicados en Express para mantener los módulos altamente cohesivos y desacoplados.

4.  **Integración Continua (CI):**
    *   Se configuró un pipeline automatizado (`.github/workflows/main.yml`). En cada `push` o `pull request` a la rama principal, el entorno ejecuta automáticamente el linter, el build y toda la suite de pruebas garantizando la estabilidad del código.

---

## Evidencia TDD: De RED a GREEN

A continuación, se demuestra el ciclo TDD aplicado durante la refactorización asíncrona para la persistencia en MongoDB.

### Fase RED (Tests fallando antes de la implementación)

```text
> trueque-verde@1.0.0 test:unit
> jest

 FAIL  src/services/UserService.test.ts
  ● Test suite failed to run
    src/services/UserService.test.ts:10:31 - error TS2345: Argument of type 'UserRepository' is not assignable to parameter of type 'MongoUserRepository'.
      The types returned by 'findByEmail(...)' are incompatible between these types.
        Type 'User | undefined' is not assignable to type 'Promise<User null |>'.

    10     service = new UserService(repository);
                                     ~~~~~~~~~~
    src/services/UserService.test.ts:31:17 - error TS2339: Property 'email' does not exist on type '{ user: User; token: string; }'.

    31     expect(user.email).toBe('a@correo.com');
                       ~~~~~

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        4.683 s
```

### Fase GREEN (Implementación y mocks asíncronos superados)

```text
> trueque-verde@1.0.0 test
> npm run test:unit && npm run test:e2e

> trueque-verde@1.0.0 test:unit
> jest

 PASS  src/services/UserService.test.ts
  UserService
    √ registra un usuario válido y guarda la contraseña hasheada (64 ms)
    √ rechaza contraseñas de menos de 8 caracteres (1 ms)
    √ rechaza el registro si el email ya existe (53 ms)
    √ permite el login con credenciales correctas y devuelve un token (110 ms)
    √ rechaza el login con contraseña incorrecta (105 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Time:        2.117 s

> trueque-verde@1.0.0 test:e2e
> cucumber-js --require-module ts-node/register --require tests/step_definitions/**/*.ts features/**/*.feature

14 scenarios (14 passed)
52 steps (52 passed)
0m 0.950s (0m 0.902s executing your code)
```