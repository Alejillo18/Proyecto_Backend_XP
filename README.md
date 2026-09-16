# 🌱 Trueque Verde - Backend API

Plataforma para que vecinos intercambien plantas, esquejes y semillas sin usar dinero. Este proyecto backend está desarrollado en **TypeScript** con **Express**, aplicando rigurosamente valores y prácticas de **Extreme Programming (XP)** y **Behavior-Driven Development (BDD)**.

## Tecnologías

*   **Node.js & Express:** Framework web para la creación de la API REST.
*   **TypeScript:** Modo estricto activado para mayor seguridad de tipos.
*   **Cucumber:** Pruebas End-to-End y BDD utilizando sintaxis Gherkin.
*   **Jest:** Pruebas unitarias de los servicios.
*   **Bcrypt:** Hashing y seguridad de contraseñas.
*   **GitHub Actions:** Integración Continua (CI).

---

##  Instrucciones de Ejecución

### 1. Instalación
Cloná el repositorio e instalá las dependencias requeridas:
```bash
git clone https://github.com/Alejillo18/Proyecto_Backend_XP.git
cd trueque-verde
npm install
```

### 2. Levantar el entorno de desarrollo
Para iniciar el servidor local con hot-reload (utilizando `ts-node-dev`), ejecutá el siguiente comando:
```bash
npm run dev
```
El servidor estará escuchando en el puerto 3000 y se reiniciará automáticamente ante cualquier cambio en el código fuente.

### 3. Compilar a producción (Build)
Para compilar el código TypeScript a JavaScript estricto:
```bash
npm run build
npm start
```

---

##  Suite de Pruebas (TDD/BDD)

Este proyecto fue construido utilizando BDD como pilar fundamental. Las pruebas aseguran que la lógica de negocio cumple exactamente con lo esperado por las Historias de Usuario (Fase 1 y 2).

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

## 🧠 Decisiones de Diseño basadas en Extreme Programming (XP)

El desarrollo de la arquitectura y el código de este backend se guió estrictamente por las siguientes prácticas de XP:

1.  **Desarrollo Guiado por Pruebas (TDD/BDD):**
    *   Se definió el comportamiento del sistema mediante criterios de aceptación traducidos a sintaxis Gherkin (archivos `.feature`).
    *   Se implementaron los *Step Definitions* de Cucumber, pasando por una **Fase RED** obligatoria (pruebas fallidas) antes de escribir el código de producción.
    *   El código de la API se escribió con el único objetivo de poner estas pruebas en **GREEN**.

2.  **Diseño Simple (YAGNI - *You Aren't Gonna Need It*):**
    *   Para satisfacer las pruebas de BDD de la forma más rápida y directa, se implementaron **Repositorios en Memoria** (`InMemoryRepositories`). Esto evitó la sobreingeniería temprana de configurar bases de datos antes de tener la lógica de negocio validada.
    *   La arquitectura aplica **Separación de Responsabilidades (SRP)** e **Inyección de Dependencias** mediante un `AppContainer`. Esto permitirá escalar a PostgreSQL o MongoDB en el futuro sin modificar una sola línea de los Servicios o Controladores.

3.  **Refactorización Continua:**
    *   Una vez que las pruebas pasaron a verde, el código fue refactorizado iterativamente sin alterar el comportamiento. Se centralizaron las validaciones de pertenencia de publicaciones y se implementó un enrutador (`Router`) en Express para desacoplar responsabilidades del archivo principal de la aplicación.

4.  **Integración Continua (CI):**
    *   Se configuró un pipeline automatizado (`.github/workflows/main.yml`) que garantiza la calidad del código. En cada `push` o `pull request` a la rama principal, el entorno ejecuta automáticamente el linter, el build y toda la suite de pruebas. Si alguna validación falla, el pipeline se bloquea, asegurando que `main` sea siempre desplegable.