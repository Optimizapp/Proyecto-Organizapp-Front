# Semana 5 - Persona 4 - Módulo de procesos

## Objetivo de Semana 5

Para Semana 5, el objetivo de Persona 4 es preparar la validación y demostración del módulo de procesos, mostrando el avance real del visor y editor básico, sin reportar el módulo como completo al 100%.

El módulo de procesos todavía requiere integración adicional para completar el flujo avanzado proceso → versión → node → flow.

## Estado final del módulo de procesos

### Avance reconocido

Durante el desarrollo se avanzó en los siguientes puntos:

- Visor básico de procesos.
- Listado de procesos.
- Filtros por nombre.
- Filtros por estado.
- Navegación hacia vista detalle.
- Botón para crear proceso.
- Botón para editar proceso.
- Formulario reactivo para creación y edición básica.
- Validaciones básicas del formulario.
- Rutas de creación y edición:
  - `/processes/new`
  - `/processes/:id/edit`

## Alcance demostrable en Semana 5

Para la demostración final, Persona 4 puede mostrar:

1. Ingreso al módulo de procesos.
2. Visualización del listado de procesos.
3. Uso de filtros por nombre y estado.
4. Navegación al detalle de un proceso.
5. Acceso al formulario de creación de proceso.
6. Validaciones del formulario.
7. Acceso al formulario de edición de proceso.
8. Explicación del alcance actual del editor básico.

## Pendientes del módulo de procesos

El módulo de procesos no debe reportarse como completo, porque todavía faltan:

- Resolver conflictos del PR de Semana 3 con `main`.
- Integrar el editor básico con la estructura actualizada del proyecto.
- Reemplazar datos mock por integración real con backend, si el endpoint definitivo está disponible.
- Agregar selects reales en el editor:
  - Empresa.
  - Usuario responsable.
  - Pool principal.
- Agregar versiones de proceso.
- Agregar nodes.
- Agregar flows.
- Validar el flujo completo:
  - Proceso → versión → node → flow.
- Agregar pruebas funcionales finales después de integrar con `main`.

## Checklist de validación para Semana 5

Cuando se resuelvan los conflictos y se integre el módulo, se debe validar:

- [ ] La ruta `/processes` carga correctamente.
- [ ] El listado de procesos se muestra.
- [ ] El filtro por nombre funciona.
- [ ] El filtro por estado funciona.
- [ ] El botón limpiar filtros funciona.
- [ ] La navegación a detalle funciona.
- [ ] La ruta `/processes/new` carga correctamente.
- [ ] El formulario de creación muestra validaciones.
- [ ] El formulario permite crear un proceso básico.
- [ ] La ruta `/processes/:id/edit` carga correctamente.
- [ ] El formulario de edición carga datos existentes.
- [ ] El formulario permite editar un proceso básico.
- [ ] La navegación de regreso al listado funciona.
- [ ] Se documentan pendientes de versiones, nodes y flows.

## Riesgos identificados

- La rama del editor de procesos presenta conflictos con `main`.
- La rama `main` ha cambiado constantemente, por lo que se debe integrar con cuidado.
- El editor básico todavía no representa el flujo completo del sistema.
- La integración real con backend depende de los endpoints disponibles.
- El módulo todavía no incluye versiones, nodes ni flows.

## Guion sugerido para la demo

Para presentar el módulo de procesos, se puede decir:

> En el módulo de procesos se avanzó en el visor y editor básico. Se puede mostrar el listado de procesos, filtros por nombre y estado, navegación al detalle y formularios básicos para crear y editar procesos. Sin embargo, el flujo completo proceso → versión → node → flow todavía queda pendiente de integración, junto con los selects reales de empresa, usuario y pool.

## Conclusión de Semana 5

Para Semana 5, Persona 4 deja preparado el estado real del módulo de procesos para la demostración final. El visor y editor básico representan un avance funcional, pero el módulo completo todavía requiere integración con versiones, nodes, flows, selects reales y backend definitivo.