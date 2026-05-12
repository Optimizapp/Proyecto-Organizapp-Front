# Semana 5 - Persona 4 - Validacion y demo del modulo de procesos

## Objetivo de Semana 5

Para Semana 5, el objetivo de Persona 4 es preparar la validacion y demostracion del modulo de procesos con el alcance real disponible en `main`.

La demo no debe presentar el modulo como completo. Debe mostrarlo como visor/editor basico funcional, porque el flujo avanzado proceso -> version -> node -> flow todavia no esta implementado de forma completa en la UI.

## Estado funcional disponible para demo

En `main` ya se puede demostrar:

- Listado de procesos conectado al backend real.
- Filtros por nombre.
- Filtros por estado.
- Navegacion al detalle de un proceso.
- Ruta `/processes/new`.
- Ruta `/processes/:id/edit`.
- Formulario reactivo para creacion basica.
- Formulario reactivo para edicion basica.
- Validaciones basicas del formulario.
- Manejo basico de carga y errores.
- `ProcessService` real usando `HttpClient`, `environment.apiUrl` y `HttpParams`.
- Manejo de errores con `ApiErrorService`.

## Alcance demostrable en Semana 5

Para la demostracion final, Persona 4 puede mostrar:

1. Ingreso al modulo de procesos.
2. Visualizacion del listado de procesos.
3. Uso del filtro por nombre.
4. Uso del filtro por estado.
5. Limpieza de filtros.
6. Navegacion al detalle de un proceso.
7. Acceso al formulario de creacion de proceso.
8. Validaciones del formulario.
9. Creacion basica de un proceso, si el backend y datos relacionados estan disponibles.
10. Acceso al formulario de edicion de proceso.
11. Carga de datos existentes en modo edicion.
12. Edicion basica de un proceso.
13. Explicacion clara de los pendientes del flujo avanzado.

## Lo que no se debe prometer como completo

El modulo de procesos no debe reportarse como completo porque todavia faltan:

- UI de versiones de proceso.
- UI de nodes.
- UI de flows.
- Editor visual completo del proceso.
- Selects reales para:
  - Empresa.
  - Usuario responsable.
  - Pool principal.
- Flujo completo:
  - Proceso -> version -> node -> flow.
- Visualizacion integrada del proceso y sus componentes.
- Pruebas funcionales mas completas del flujo completo.

## Checklist de validacion para Semana 5

Antes de la demo se debe validar:

- [ ] La ruta `/processes` carga correctamente.
- [ ] El listado de procesos se muestra desde backend real.
- [ ] El filtro por nombre funciona.
- [ ] El filtro por estado funciona.
- [ ] El boton limpiar filtros funciona.
- [ ] La navegacion a detalle funciona.
- [ ] La ruta `/processes/new` carga correctamente.
- [ ] El formulario de creacion muestra validaciones.
- [ ] El formulario permite crear un proceso basico cuando existen datos relacionados validos.
- [ ] La ruta `/processes/:id/edit` carga correctamente.
- [ ] El formulario de edicion carga datos existentes.
- [ ] El formulario permite editar un proceso basico.
- [ ] La navegacion de regreso al listado funciona.
- [ ] Los errores del backend se muestran de forma comprensible.
- [ ] La demo menciona explicitamente que versiones, nodes, flows, selects reales y flujo completo siguen pendientes.

## Riesgos identificados

- Las ramas antiguas `feature/process-viewer-p4` y `feature/process-editor-p4` no deben mergearse directamente porque quedaron desactualizadas frente a `main`.
- Los conflictos y mocks eran riesgos de esas ramas antiguas, no del estado actual de `main`.
- El editor basico todavia usa IDs manuales para datos relacionados.
- Sin selects reales, la creacion/edicion depende de que el usuario conozca IDs validos.
- El editor basico todavia no representa el flujo completo del sistema.
- La demo debe evitar presentar versions, nodes y flows como funcionalidad terminada.

## Aclaracion sobre ramas antiguas

Las ramas antiguas `feature/process-viewer-p4` y `feature/process-editor-p4` no deben mergearse directamente. El avance util fue integrado manualmente sobre `main`, conservando backend real y evitando mocks productivos.

La base correcta para continuar el modulo es `main`, donde ya estan integrados el visor, el editor basico, las rutas de creacion/edicion, `ProcessService` real y `ApiErrorService`.

## Guion sugerido para la demo

Para presentar el modulo de procesos, se puede decir:

> En el modulo de procesos se avanzo en un visor y editor basico funcional integrado en main. Se puede mostrar el listado de procesos, filtros por nombre y estado, navegacion al detalle y formularios basicos para crear y editar procesos. Sin embargo, el modulo completo todavia requiere UI de versiones, nodes, flows, selects reales y el flujo proceso -> version -> node -> flow.

## Conclusion de Semana 5

Semana 5 queda orientada a validacion y demo del alcance real, no a declarar el cierre total del modulo. El avance funcional de visor/editor basico es demostrable, pero Persona 4 todavia debe completar versiones, nodes, flows, selects reales, visualizacion integrada y pruebas funcionales mas completas para considerar cerrado el modulo de procesos.
