# habit-score

Aplicación fullstack para registrar hábitos diarios y calcular un puntaje de balance personal.  
Proyecto pensado como aprendizaje real y portfolio técnico, con frontend desacoplado, backend persistente y modo offline-first.

## Descripción

habit-score permite crear hábitos con nombre, categoría y puntaje (positivo o negativo), marcarlos como realizados en el día y calcular un puntaje diario en base a esas acciones.

La aplicación puede funcionar sin backend utilizando localStorage y sincronizar con un backend cuando está disponible.

El proyecto está organizado como un monorepo con frontend y backend separados, conectados mediante una API REST versionada.

## Stack tecnológico

### Frontend
- React
- Vite
- JavaScript (sin TypeScript)
- CSS puro (sin frameworks)
- useState y useMemo para manejo de estado
- Persistencia offline con localStorage

### Backend
- Node.js
- Express
- API REST (/api/v1)
- Prisma ORM
- SQLite
- dotenv para variables de entorno

## Estructura del repositorio

  habit-score/
  ├─ frontend/
  ├─ backend/
  ├─ docs/
  ├─ scripts/
  ├─ package.json
  └─ README.md

## Variables de entorno

### Backend

Crear el archivo backend/.env (no se versiona).  
Usar backend/.env.template como referencia.

Ejemplo:

DATABASE_URL="file:./dev.db"  
PORT=3000  
CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174"

### Frontend

Archivo opcional frontend/.env.

VITE_API_BASE_URL=/api/v1

## Instalación

Backend:

cd backend  
npm install

Frontend:

cd frontend  
npm install

## Desarrollo

Levantar frontend y backend en paralelo desde la raíz:

npm run dev

Comandos individuales:

npm run dev:backend  
npm run dev:frontend

En desarrollo, el frontend usa proxy de Vite para acceder a la API sin problemas de CORS.

## Producción local (simulada)

El backend sirve el frontend compilado y la API bajo el mismo origin.

Build del frontend:

npm run build:frontend

Iniciar backend sirviendo el frontend:

npm run start:backend

O todo junto:

npm run prod

La aplicación queda disponible en:

http://localhost:3000

Health check de la API:

http://localhost:3000/api/v1/health

## Base de datos (Prisma)

Migraciones:

npx prisma migrate dev

Ver base de datos:

npx prisma studio

Notas:
- El esquema y las migraciones se versionan
- El archivo SQLite (*.db) no se versiona

## API

La especificación de la API se encuentra en:

docs/api-spec-v1.md

Incluye endpoints, DTOs, validaciones y formato de errores.

## Estado del proyecto

- Frontend funcional
- Backend funcional
- Persistencia real con SQLite
- Modo offline-first
- Arquitectura preparada para producción

## Notas finales

Proyecto pensado como base sólida para aprendizaje real, portfolio profesional y futura evolución a producto vendible.  
No se utilizan frameworks de UI ni librerías innecesarias.
