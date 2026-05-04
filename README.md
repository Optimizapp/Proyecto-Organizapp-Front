# Optimizapp / Organizapp Frontend

Frontend Angular standalone para consumir la API REST de Optimizapp / Organizapp.

## Requisitos

- Node.js 20.
- npm.
- Backend REST disponible. En desarrollo local se espera en `http://localhost:8080/api`.

## Instalacion

```bash
npm ci
```

Si necesitas actualizar dependencias durante desarrollo:

```bash
npm install
```

## Ejecucion local

```bash
npm start
```

La aplicacion queda disponible en `http://localhost:4200/`.

En Windows, si PowerShell bloquea `npm.ps1`, usa los comandos con `npm.cmd`, por ejemplo:

```bash
npm.cmd start
```

## Backend URL y environments

La URL base del backend se configura en:

- `src/environments/environment.ts`: `http://localhost:8080/api`.
- `src/environments/environment.prod.ts`: `/api`.

Los servicios HTTP deben construir sus rutas con `environment.apiUrl`. No se deben hardcodear URLs de backend dentro de componentes o servicios.

## Comandos principales

```bash
npm run build
npm test -- --watch=false
```

En Windows:

```bash
npm.cmd run build
npm.cmd test -- --watch=false
```

## Endpoints consumidos

Los servicios actuales consumen estos recursos principales:

| Recurso | Ruta base |
|---|---|
| Companies | `/api/companies` |
| Company registration | `/api/companies/register` |
| Users | `/api/users` |
| Roles | `/api/roles` |
| Permissions | `/api/permissions` |
| Pools | `/api/pools` |
| Lanes | `/api/lanes` |
| Processes | `/api/processes` |
| Process versions | `/api/process-versions` |
| Publish process version | `/api/process-versions/{id}/publish` |
| Nodes | `/api/nodes` |
| Flows | `/api/flows` |

Los filtros se envian como query params con `HttpParams`, por ejemplo `companyId`, `processId`, `poolId`, `roleId`, `versionId` y `status`.

## Flujo de integracion funcional

1. Registrar empresa con `/companies/register`.
2. Consultar o crear roles.
3. Crear usuarios asociados a empresa y rol.
4. Crear pools de proceso.
5. Crear lanes dentro de pools.
6. Crear procesos asociados a empresa, usuario y pool principal.
7. Crear versiones de proceso.
8. Crear nodes de la version.
9. Crear flows entre nodes.
10. Publicar versiones cuando el backend lo permita.

## Manejo de errores

El backend retorna errores con formato `ApiErrorResponse`:

```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "message": "Datos invalidos",
  "path": "/api/...",
  "fields": {
    "campo": "mensaje"
  }
}
```

El frontend centraliza la interpretacion en `src/app/core/services/api-error.service.ts`. Actualmente cubre errores de red `status 0`, `400`, `404`, `409`, `500` y errores inesperados.

## Seguridad

JWT, guards definitivos e interceptor JWT estan pendientes porque el backend todavia no tiene Spring Security/JWT final. No se debe simular seguridad en el frontend antes de cerrar el contrato backend.

## Docker

El proyecto tiene SSR habilitado en `angular.json` (`outputMode: "server"`), por eso el Dockerfile usa Node.js y ejecuta el servidor generado por Angular:

```bash
docker build -t optimizapp-front .
docker run --rm -p 4000:4000 optimizapp-front
```

La aplicacion queda disponible en `http://localhost:4000/`.

## CI

El workflow `.github/workflows/frontend-ci.yml` ejecuta:

1. `npm ci`
2. `npm run build`
3. `npm test -- --watch=false`

## Estado de Semana 2 Persona 1

La responsabilidad de integracion queda documentada en `docs/semana-2-persona-1.md`.
