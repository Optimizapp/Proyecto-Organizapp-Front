# Semana 2 - Persona 1: Integracion y seguimiento tecnico

## Objetivo

Cerrar la base tecnica de integracion frontend/backend para Optimizapp / Organizapp: servicios HTTP Angular, DTOs compartidos, manejo de errores, build/test, CI, Docker minimo y seguimiento del avance.

## Que se hizo

- Se mantienen servicios HTTP Angular para los recursos principales del backend.
- Los servicios usan `environment.apiUrl`.
- Se agregaron y ampliaron pruebas con `HttpTestingController`.
- Se mantiene `ApiErrorService` para interpretar `ApiErrorResponse`.
- Se agrego CI de frontend en GitHub Actions.
- Se corrigio Docker para ejecutar la aplicacion Angular SSR con Node.
- Se actualizo README tecnico.
- Se elimino legacy no usado.

## Servicios existentes

| Servicio | Ruta base | Estado |
|---|---|---|
| `CompanyService` | `/companies` | CRUD, register y tests |
| `UserService` | `/users` | CRUD y tests |
| `RoleService` | `/roles` | Listado filtrado, create, update, delete y tests |
| `PermissionService` | `/permissions` | Listado filtrado, create, delete y tests |
| `PoolService` | `/pools` | CRUD con filtro y tests |
| `LaneService` | `/lanes` | CRUD con filtro y tests |
| `ProcessService` | `/processes` | CRUD con filtros y tests |
| `ProcessVersionService` | `/process-versions` | Listado, get, create, update, publish y tests |
| `NodeService` | `/nodes` | CRUD con filtro y tests |
| `FlowService` | `/flows` | CRUD con filtro y tests |

## Modelos existentes

Los DTOs centralizados estan en `src/app/core/models`:

- `api-error-response.model.ts`
- `company.model.ts`
- `user.model.ts`
- `role.model.ts`
- `permission.model.ts`
- `pool.model.ts`
- `lane.model.ts`
- `process.model.ts`
- `process-version.model.ts`
- `node.model.ts`
- `flow.model.ts`
- `ui-error-state.model.ts`
- `index.ts`

Los re-exports legacy que apuntan a `core/models` se mantienen solo para compatibilidad si algun integrante los usa en ramas paralelas.

## Pruebas existentes

- Specs HTTP para companies, users, roles, permissions, pools, lanes, processes, process versions, nodes y flows.
- Specs de `ApiErrorService` para:
  - `ApiErrorResponse` con message.
  - `fields`.
  - `status 0`.
  - `400` sin body ni fields.
  - `404`.
  - `409`.
  - `500`.
  - error inesperado.
- Specs de vistas principales de procesos y layout.

## Estado build/test

Comandos de validacion:

```bash
npm.cmd run build
npm.cmd test -- --watch=false
```

En CI Linux:

```bash
npm run build
npm test -- --watch=false
```

## Estado Docker/CI

- CI creado en `.github/workflows/frontend-ci.yml`.
- Docker usa Node SSR porque `angular.json` tiene `outputMode: "server"`.
- Runtime Docker esperado: `node dist/mi-primer-proyecto/server/server.mjs`.

## Que queda pendiente

- Validar DTOs contra contrato backend definitivo cuando exista OpenAPI o backend estable.
- Definir autenticacion cuando backend cierre Spring Security/JWT.
- Evaluar interceptor global de errores si el equipo quiere centralizar efectos transversales.
- Agregar e2e cuando el flujo completo frontend/backend este estable.

## Que NO se implemento

- No se implemento JWT.
- No se implementaron guards definitivos.
- No se implemento interceptor JWT.
- No se simulo seguridad en frontend.

## Limpieza realizada

- Se elimino `listar-estudiantes` por no estar usado en rutas/imports.
- Se elimino `auth.model.ts` por ser prematuro y depender de JWT pendiente.
- Se eliminaron modelos vacios no usados: `comment.models.ts` y `nodeAtribute.models.ts`.

## Checklist final

| Item | Estado |
|---|---|
| Servicios HTTP existen | Hecho |
| Servicios usan `environment.apiUrl` | Hecho |
| Filtros usan `HttpParams` | Hecho |
| Specs HTTP clave | Hecho |
| Manejo de errores centralizado | Hecho |
| Tests 409/500/400 sin body | Hecho |
| CI minimo | Hecho |
| Docker coherente con SSR | Hecho |
| README tecnico | Hecho |
| Legacy no usado eliminado | Hecho |
| JWT no implementado por backend pendiente | Hecho |
