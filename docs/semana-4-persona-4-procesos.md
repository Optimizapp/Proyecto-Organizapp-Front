# Semana 4 - Persona 4 - Módulo de procesos

## Estado general

Para Semana 4, el módulo de procesos no se reporta como completo al 100%, porque todavía faltan elementos importantes del flujo completo del sistema:

- Versiones de proceso.
- Nodes.
- Flows.
- Selects reales en el editor.
- Flujo completo proceso → versión → node → flow.
- Integración final con la estructura actualizada de `main`.

Sin embargo, sí se reconoce un avance funcional importante en el visor y editor básico de procesos.

## Avance reconocido de Persona 4

Durante las semanas anteriores se avanzó en:

- Visor básico de procesos.
- Listado de procesos.
- Filtros por nombre.
- Filtros por estado.
- Navegación hacia vista detalle.
- Botón para crear proceso.
- Botón para editar proceso.
- Formulario reactivo para creación/edición básica.
- Validaciones básicas en formulario.
- Rutas para creación y edición:
  - `/processes/new`
  - `/processes/:id/edit`

## Estado de integración con main

El Pull Request de Semana 3 fue creado hacia `main`, pero GitHub marca conflictos debido a que la rama `main` ha sido actualizada constantemente por otros integrantes del equipo.

Se intentó actualizar la rama local con `origin/main`, pero aparecieron conflictos en archivos relacionados con:

- Rutas principales.
- App principal.
- Listado de procesos.
- Formulario de procesos.
- Servicio de procesos.

Para evitar pisar cambios de otros integrantes, se abortó el merge local y se dejó el PR pendiente para revisión de conflictos por parte del equipo.

## Pendientes del módulo de procesos

Para que el módulo de procesos pueda considerarse completo, faltan:

1. Resolver conflictos con `main`.
2. Integrar el visor/editor básico con la estructura actualizada del proyecto.
3. Reemplazar datos mock por integración real con backend si el endpoint está disponible.
4. Agregar selects reales en el editor:
   - Empresa.
   - Usuario responsable.
   - Pool principal.
5. Agregar gestión de versiones de proceso.
6. Agregar gestión de nodes.
7. Agregar gestión de flows.
8. Validar el flujo completo:
   - Proceso → Versión → Node → Flow.
9. Agregar pruebas funcionales o checklist de validación.
10. Preparar demo del alcance actual.

## Semana 4 - Acción realizada

Para Semana 4 se deja documentado el estado real del módulo, diferenciando entre:

- Avance ya realizado.
- Funcionalidad básica disponible.
- Pendientes técnicos.
- Riesgos de integración con `main`.

Esto evita reportar el módulo como completo cuando todavía faltan partes importantes del flujo avanzado.

## Semana 5 - Plan de validación

Para Semana 5, la Persona 4 debe enfocarse en:

- Validar que el visor de procesos funcione después de resolver conflictos.
- Probar listado de procesos.
- Probar filtros por nombre y estado.
- Probar navegación al detalle.
- Probar creación básica de proceso.
- Probar edición básica de proceso.
- Verificar validaciones del formulario.
- Documentar que versiones, nodes y flows quedan pendientes si no se integran antes de la entrega final.
- Apoyar la demo mostrando el alcance real del módulo de procesos.

## Mensaje sugerido para la demo

El módulo de procesos cuenta con un avance en visor y editor básico. Se puede mostrar listado, filtros, detalle y formulario básico de creación/edición. Sin embargo, el flujo completo proceso → versión → node → flow todavía queda pendiente de integración, junto con selects reales y conexión final con backend.