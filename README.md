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

## Despliegue Angular con Docker y Kubernetes

Esta estructura sigue el enfoque de la presentacion "Despliegue de Angular - Hosting tradicional / Docker / Kubernetes": Angular se compila y se sirve con Nginx en una imagen Docker, y luego puede desplegarse en Kubernetes con Deployment, Service e Ingress.

El frontend sigue la misma convencion de despliegue usada por el backend:

- `Dockerfile` en la raiz del repositorio.
- Workflow en `.github/workflows/deploy.yml`.
- Manifiestos Kubernetes en `k8s/deployment.yaml`.
- Namespace Kubernetes: `grupo14`.
- Imagen esperada: `ghcr.io/optimizapp/proyecto_organizapp_front:latest`.
- `imagePullSecrets`: `ghcr-secret`.

El frontend se sirve por Nginx en el puerto `80`. El backend se espera en Kubernetes por el puerto `8080`.

### Dockerfile

El `Dockerfile` arma la imagen de la aplicacion Angular:

1. Usa una etapa `node:20-alpine` para instalar dependencias y ejecutar `npm run build -- --configuration production`.
2. Usa una etapa `nginx:1.27-alpine` para servir los archivos generados.
3. Copia la salida real del build desde `dist/mi-primer-proyecto/browser`.
4. Expone el puerto `80`.

Nota: el proyecto conserva configuracion SSR en `angular.json` (`outputMode: "server"`). Para cumplir el enfoque de hosting tradicional de la presentacion, la imagen Docker sirve la salida `browser` con Nginx. Como Angular SSR genera `index.csr.html` en esa salida, el Dockerfile crea `index.html` a partir de ese archivo para que el fallback SPA de Nginx funcione.

### nginx.conf

El archivo `nginx.conf` configura Nginx para servir Angular como SPA:

- Escucha en puerto `80`.
- Usa `/usr/share/nginx/html` como raiz.
- Redirige rutas internas de Angular a `/index.html` con `try_files`.

Esto permite que rutas como `/processes` o `/processes/1` funcionen al recargar la pagina desde el navegador.

### .github/workflows/deploy.yml

El workflow `.github/workflows/deploy.yml` representa el paso "Actions - Despliegue automatico" y separa dos momentos:

- Hace checkout del repositorio.
- Inicia sesion en GHCR usando `secrets.GITHUB_TOKEN`.
- Construye la imagen `ghcr.io/optimizapp/proyecto_organizapp_front:latest`.
- Publica la imagen en GHCR.
- Ejecuta el despliegue on premise con `kubectl apply -f k8s/deployment.yaml`.

Antes de usarlo en un despliegue real se deben reemplazar:

- Configurar permisos de Packages/GHCR para publicar la imagen.
- Crear el secreto `KUBE_CONFIG` en GitHub Actions con el kubeconfig del cluster codificado en base64.
- Confirmar que el secret Kubernetes `ghcr-secret` exista en el namespace `grupo14`.

### deployment.yaml

El archivo `k8s/deployment.yaml` contiene la estructura Kubernetes indicada por la presentacion:

- `Deployment`
- `Service`
- `Ingress`

Usa `namespace: grupo14`, `name: organizapp-frontend`, imagen `ghcr.io/optimizapp/proyecto_organizapp_front:latest`, `containerPort: 80`, `imagePullSecrets: ghcr-secret`, `ingressClassName: nginx`, annotation `nginx.ingress.kubernetes.io/rewrite-target: /` y host `grupo14.inphotech.co`.

### Build local

Para generar la salida de Angular localmente:

```bash
npm run build
```

En Windows, si PowerShell bloquea `npm.ps1`:

```bash
npm.cmd run build
```

### Probar con Docker Desktop

Con Docker Desktop activo:

```bash
docker build -t optimizapp-front .
docker run --rm -p 8080:80 optimizapp-front
```

La aplicacion queda disponible en `http://localhost:8080/`.

## CI

El workflow `.github/workflows/frontend-ci.yml` ejecuta:

1. `npm ci`
2. `npm run build`
3. `npm test -- --watch=false`

## Estado de Semana 2 Persona 1

La responsabilidad de integracion queda documentada en `docs/semana-2-persona-1.md`.
