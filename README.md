habit-score

Aplicación fullstack para registrar hábitos diarios y calcular un puntaje de balance personal.
Proyecto pensado como aprendizaje real y portfolio técnico, con frontend desacoplado, backend persistente y modo offline-first.

DESCRIPCIÓN GENERAL

habit-score permite registrar hábitos diarios y calcular un puntaje basado en acciones positivas y negativas.
El usuario puede crear hábitos con nombre, categoría y puntaje, marcarlos como realizados en el día y ver el puntaje diario resultante.
La aplicación puede funcionar sin backend usando almacenamiento local y sincronizar con el servidor cuando está disponible.

El proyecto está organizado como un monorepo con frontend y backend separados, conectados mediante una API REST versionada.

STACK TECNOLÓGICO

Frontend: React, Vite, JavaScript sin TypeScript, CSS puro sin frameworks.
El manejo de estado se realiza con useState y useMemo.
La persistencia offline se implementa mediante localStorage.

Backend: Node.js, Express y arquitectura por capas separando rutas, controladores, servicios y DTOs.
La API es REST y está versionada bajo /api/v1.
La persistencia se realiza con Prisma ORM y una base de datos SQLite local.

ESTRUCTURA DEL REPOSITORIO

habit-score contiene las carpetas frontend, backend, docs y scripts.
Frontend incluye el código React con Vite.
Backend incluye Express, Prisma, el esquema de base de datos y las migraciones.
Docs contiene la especificación de la API.
Scripts incluye utilidades para desarrollo en modo monorepo.

API

La API del proyecto está documentada en el archivo docs/api-spec-v1.md.
Ese archivo define los endpoints disponibles, los DTOs, las reglas de validación y el formato de errores.
El frontend consume exclusivamente esta API y no conoce detalles de base de datos ni del ORM.

MODO OFFLINE-FIRST

Al iniciar la aplicación, el frontend intenta obtener los hábitos desde la API.
Si el backend no está disponible, se cargan los datos desde localStorage.

Al crear o modificar hábitos, la interfaz se actualiza inmediatamente.
Los datos se guardan siempre en localStorage.
Si el backend está disponible, se intenta sincronizar la información.

Este enfoque permite usar la aplicación sin conexión, evitar pérdida de datos y mantener una experiencia fluida.

SCRIPTS DISPONIBLES

Desde la raíz del repositorio se puede ejecutar npm run dev para levantar frontend y backend en paralelo.
El frontend corre en localhost en el puerto que asigne Vite.
El backend corre en http://localhost:3000.

También es posible levantar solo el frontend con npm run dev:frontend o solo el backend con npm run dev:backend.

BASE DE DATOS

La base de datos utiliza SQLite mediante Prisma.
Las migraciones se ejecutan desde la carpeta backend con prisma migrate dev.
La base puede inspeccionarse visualmente usando prisma studio.

El archivo de base de datos no se versiona.
El esquema y las migraciones sí se versionan.

REQUISITOS

Node.js versión 20.19 o superior, o 22.12 o superior.
npm.

ESTADO DEL PROYECTO

El frontend es funcional.
El backend es funcional.
Existe persistencia real con SQLite.
La API versión 1 es estable.
El proyecto está preparado para extenderse con nuevas funcionalidades.

NOTAS FINALES

Este proyecto está pensado para aprendizaje técnico real y para demostrar criterio arquitectónico.
Sirve como base para futuras iteraciones y mejoras.
No se utilizan frameworks de UI ni librerías externas innecesarias.