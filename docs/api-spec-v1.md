# API Habit-Score v1

Ruta base: /api/v1

Este documento define el contrato HTTP entre el frontend y el backend de la aplicación Habit-Score.

## Convenciones generales

Todas las solicitudes y respuestas utilizan JSON.

Las solicitudes que envían datos deben incluir el encabezado:
Content-Type: application/json

Los identificadores (id) son strings generados por la base de datos.

Las fechas se devuelven como strings en formato ISO.

La API no maneja usuarios ni autenticación en esta versión.

## Modelo de datos

Habit

Representa un hábito y su estado del día actual.

Campos:
- id: string
- name: string
- category: string
- points: number (puede ser negativo)
- isDoneToday: boolean
- createdAt: string (ISO)
- updatedAt: string (ISO)

Ejemplo de objeto Habit:

{
  "id": "cml5g5vi40000vis83dr8hvg1",
  "name": "Caminar 20 minutos",
  "category": "Actividad",
  "points": 10,
  "isDoneToday": false,
  "createdAt": "2026-02-02T18:20:51.123Z",
  "updatedAt": "2026-02-02T18:21:10.456Z"
}

## Formato de errores

Todos los errores siguen esta estructura:

{
  "errorCode": "CODIGO_ERROR",
  "message": "Descripción legible del error"
}

Códigos comunes:
- VALIDATION_ERROR
- NOT_FOUND
- INTERNAL_ERROR

## Health Check

GET /health

Respuesta 200:

{
  "status": "ok"
}

## Endpoints de hábitos

GET /habits

Devuelve la lista completa de hábitos.

Respuesta 200:

{
  "items": [
    {
      "id": "cml5g5vi40000vis83dr8hvg1",
      "name": "Caminar 20 minutos",
      "category": "Actividad",
      "points": 10,
      "isDoneToday": false,
      "createdAt": "2026-02-02T18:20:51.123Z",
      "updatedAt": "2026-02-02T18:21:10.456Z"
    }
  ]
}

POST /habits

Crea un nuevo hábito.

Body de la solicitud:

{
  "name": "Caminar 20 minutos",
  "category": "Actividad",
  "points": 10
}

Reglas de validación:
- name: obligatorio, string no vacío
- category: obligatorio, string no vacío
- points: obligatorio, número entero entre -100 y 100

Respuesta 201:

{
  "item": {
    "id": "cml5g5vi40000vis83dr8hvg1",
    "name": "Caminar 20 minutos",
    "category": "Actividad",
    "points": 10,
    "isDoneToday": false,
    "createdAt": "2026-02-02T18:20:51.123Z",
    "updatedAt": "2026-02-02T18:20:51.123Z"
  }
}

PATCH /habits/:id/toggle

Alterna el valor de isDoneToday del hábito indicado.

Parámetros de ruta:
- id: identificador del hábito

No requiere body.

Respuesta 200:

{
  "item": {
    "id": "cml5g5vi40000vis83dr8hvg1",
    "name": "Caminar 20 minutos",
    "category": "Actividad",
    "points": 10,
    "isDoneToday": true,
    "createdAt": "2026-02-02T18:20:51.123Z",
    "updatedAt": "2026-02-02T18:21:10.456Z"
  }
}

Errores posibles:
- 404 NOT_FOUND
- 500 INTERNAL_ERROR

DELETE /habits/:id

Elimina un hábito por id.

Parámetros de ruta:
- id: identificador del hábito

Respuesta 204:
No devuelve contenido.

Errores posibles:
- 404 NOT_FOUND
- 500 INTERNAL_ERROR

## Reglas derivadas (frontend)

Estas reglas no se calculan en la API, sino en el frontend.

Puntaje diario:
Suma de points de todos los hábitos con isDoneToday en true.

Categorías:
Se obtienen dinámicamente a partir de los hábitos existentes.

## Fuera de alcance (v1)

No incluido en esta versión:
- Usuarios y autenticación
- Historial por fechas
- Puntajes semanales o mensuales
- Edición de hábitos
- Paginación o filtros del lado servidor

Estas funcionalidades pueden incorporarse en versiones futuras sin romper el contrato actual.
