# Plan de implementacion Drag and Drop en frontend

## Objetivo

El objetivo es permitir que registros del frontend de Organizapp puedan cambiar de posicion mediante una interaccion de arrastrar y soltar.

Drag and Drop es un patron de interfaz donde el usuario selecciona un elemento, lo arrastra y lo suelta en una nueva posicion. En Organizapp se necesita para que ciertos registros puedan cambiar de orden sin editar manualmente IDs, posiciones o campos tecnicos.

El primer caso de uso recomendado es reordenar elementos dentro de una misma lista, por ejemplo:

- Reordenar registros visibles en una tabla o lista.
- Reordenar lanes, nodes, pasos o elementos de un flujo cuando el backend soporte persistir el orden.
- Mejorar la experiencia de usuario sin obligar a editar posiciones manualmente.

Este documento solo define el plan tecnico. No implementa Drag and Drop todavia.

La primera fase debe ser Drag and Drop local o visual. Es decir: el usuario puede reordenar elementos en pantalla, pero ese orden no modifica datos persistidos en backend.

Como referencia de persistencia futura, el backend contempla el orden de lanes mediante `orderIndex`. Sin embargo, la persistencia robusta todavia no esta completa porque no existe un endpoint bulk de reordenamiento y la consulta por pool no garantiza orden por `orderIndex`.

## Libreria recomendada

La opcion recomendada es Angular CDK DragDrop.

Referencia oficial:

https://angular.dev/guide/drag-drop

Motivos:

- Es una libreria oficial del ecosistema Angular.
- Se integra bien con componentes standalone.
- Permite reordenar listas dentro del mismo contenedor.
- Permite mover elementos entre listas si despues se necesita.
- Soporta handles, previews, placeholders y animaciones.
- Evita agregar librerias externas innecesarias para una necesidad comun.

Segun la guia oficial de Angular, CDK DragDrop permite crear interfaces con drag and drop, listas reordenables, transferencia entre listas, animaciones, bloqueo por eje, handles personalizados, previews y placeholders.

## Caso mas parecido de la documentacion oficial

El caso mas parecido para Organizapp es el ejemplo de sorting o reordenamiento dentro de una misma lista.

Ese patron usa:

- `cdkDropList`: contenedor que agrupa los elementos arrastrables y define donde se pueden soltar.
- `cdkDrag`: directiva aplicada al elemento que se puede arrastrar.
- `(cdkDropListDropped)`: evento que se ejecuta cuando el usuario suelta el elemento.
- `CdkDragDrop<T[]>`: tipo TypeScript del evento de drop.
- `moveItemInArray`: funcion de CDK que reordena el arreglo local segun la posicion anterior y la nueva.

La guia oficial aclara un punto importante: las directivas de drag and drop no actualizan automaticamente el modelo de datos. El componente debe escuchar `cdkDropListDropped` y actualizar manualmente el arreglo local.

## Estado actual del proyecto

Actualmente `@angular/cdk` no aparece en `package.json`.

Antes de implementar se debe instalar o agregar Angular CDK al proyecto.

Tambien se debe alinear el frontend con el contrato real de lanes antes de persistir:

- El backend expone `orderIndex` en `CreateLaneRequest`, `UpdateLaneRequest` y `LaneResponse`.
- `PUT /api/lanes/{id}` permite actualizar una lane completa, incluyendo `orderIndex`.
- Si el frontend todavia no refleja `orderIndex` en sus modelos, debe actualizarse cuando se implemente la persistencia.
- Si se requiere un endpoint batch de reordenamiento, no inventarlo desde frontend; debe definirse con backend.
- Si no hay endpoint confirmado, mantener el reordenamiento solo visual/local.

## Diagnostico real del backend

El backend permite una primera fase local/visual sin problema porque Drag and Drop puede ejecutarse solo en memoria del frontend.

El unico candidato natural para persistencia parcial es `Lane`, porque tiene un campo persistible `orderIndex`.

Lo que si existe:

- `Lane` tiene campo persistible `orderIndex`.
- `CreateLaneRequest`, `UpdateLaneRequest` y `LaneResponse` exponen `orderIndex`.
- `PUT /api/lanes/{id}` permite actualizar una lane completa, incluyendo `orderIndex`.
- `Node` soporta coordenadas `x`, `y`, `width` y `height`, utiles para mover elementos en canvas, pero no para ordenar listas.

Lo que falta para persistencia robusta:

- No existe endpoint tipo `PATCH /api/lanes/reorder` o `PUT /api/lanes/order` para guardar una lista de `{ id, orderIndex }`.
- `LaneRepository.findByPoolId(poolId)` no ordena por `orderIndex`.
- El update de lane exige enviar el objeto completo, por ejemplo `name`, `active`, `poolId` y demas campos requeridos.
- No hay validacion de unicidad o consistencia de `orderIndex` dentro de un pool.
- `Pools`, `Nodes`, `Flows`, `Processes`, `Roles` y `Users` no tienen un campo de orden funcional equivalente para listas.

Conclusion: se puede implementar Drag and Drop visual/local ya. La persistencia debe limitarse a lanes y solo si el equipo acepta la limitacion de usar `PUT /api/lanes/{id}` como workaround temporal.

## Modulos candidatos para Drag and Drop

| Modulo | Tiene campo de orden? | Se puede hacer local? | Se puede persistir hoy? | Recomendacion |
|---|---|---|---|---|
| Lanes | Si, `orderIndex` | Si | Parcialmente, con `PUT /api/lanes/{id}` por lane | Primer candidato. Empezar local; persistir solo si el equipo acepta el workaround temporal. |
| Processes | No confirmado | Si | No | Solo visual/local. No implementar persistencia de orden. |
| Users | No | Si | No | Solo visual/local si aporta UX. No persistir orden. |
| Roles | No | Si | No | Solo visual/local si aporta UX. No persistir orden. |
| Pools | No | Si | No | Solo visual/local. No persistir orden. |
| Nodes | No para orden de lista; si tiene coordenadas `x`, `y`, `width`, `height` | Si | Para canvas podria persistirse posicion si el contrato lo permite | Usar Drag and Drop para canvas, no como ordenamiento de lista. |
| Flows | No hay orden funcional confirmado | Si | No confirmado | Mantener local hasta definir modelo y contrato. |

Advertencia importante: no implementar persistencia general de orden para procesos, usuarios, roles o pools porque no existe campo ni endpoint de orden.

## Drag and Drop local vs persistente

### Drag and Drop visual/local

El reordenamiento visual/local cambia el orden de los elementos solo en memoria del componente.

Caracteristicas:

- No llama backend.
- No modifica base de datos.
- Se pierde al recargar la pantalla.
- Sirve para validar la UX y el comportamiento del componente.
- Es la primera fase recomendada para Organizapp.

Ejemplo:

```ts
drop(event: CdkDragDrop<LaneResponse[]>): void {
  moveItemInArray(this.lanes, event.previousIndex, event.currentIndex);
}
```

### Drag and Drop persistente

El reordenamiento persistente guarda el nuevo orden en backend.

Caracteristicas:

- Requiere contrato backend.
- Requiere definir si se guarda por item o en batch.
- Debe manejar errores con `ApiErrorService`.
- Debe revertir el cambio visual si falla la persistencia.
- No debe implementarse hasta confirmar endpoint y DTOs.

Ejemplo conceptual usando `orderIndex` en lanes:

```ts
drop(event: CdkDragDrop<LaneResponse[]>): void {
  moveItemInArray(this.lanes, event.previousIndex, event.currentIndex);

  const reorderedLanes = this.lanes.map((lane, index) => ({
    id: lane.id,
    orderIndex: index + 1
  }));

  // Pendiente: requiere endpoint backend confirmado.
  // this.laneService.updateLaneOrder(poolId, reorderedLanes).subscribe(...)
}
```

Si no existe un endpoint como `updateLaneOrder`, no se debe crear una llamada ficticia desde frontend.

Persistencia temporal posible solo para lanes:

```ts
drop(event: CdkDragDrop<LaneResponse[]>): void {
  const previousIndex = event.previousIndex;
  const currentIndex = event.currentIndex;

  moveItemInArray(this.lanes, previousIndex, currentIndex);

  const updatedLanes = this.lanes.map((lane, index) => ({
    ...lane,
    orderIndex: index + 1
  }));

  // Workaround temporal:
  // Hacer PUT individual por cada lane exige enviar el objeto completo.
  // No es ideal porque no es transaccional y puede dejar orden parcial si una llamada falla.
  // forkJoin(updatedLanes.map((lane) => this.laneService.updateLane(lane.id, lane))).subscribe({
  //   error: () => {
  //     moveItemInArray(this.lanes, currentIndex, previousIndex);
  //   }
  // });
}
```

Este enfoque con `PUT /api/lanes/{id}` debe considerarse temporal, no una solucion ideal.

## Pasos tecnicos base

### Paso 1: Verificar o instalar Angular CDK

Opcion recomendada con Angular CLI:

```bash
ng add @angular/cdk
```

Opcion directa con npm:

```bash
npm install @angular/cdk
```

Despues de instalar, confirmar que `package.json` incluya `@angular/cdk`.

### Paso 2: Importar directivas CDK en el componente standalone

En el componente donde se vaya a usar Drag and Drop:

```ts
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  templateUrl: './example.html',
  styleUrl: './example.css'
})
export class ExampleComponent {}
```

Imports requeridos:

- `CdkDropList`
- `CdkDrag`
- `CdkDragDrop`
- `moveItemInArray`

Imports opcionales para fases posteriores:

- `CdkDragHandle`
- `CdkDragPreview`
- `CdkDragPlaceholder`

### Paso 3: Aplicar `cdkDropList` al contenedor

Ejemplo base:

```html
<div
  cdkDropList
  class="sortable-list"
  (cdkDropListDropped)="drop($event)"
>
  <div class="sortable-item" *ngFor="let item of items" cdkDrag>
    {{ item.name }}
  </div>
</div>
```

En Angular nuevo tambien se puede usar `@for`, pero se recomienda mantener el estilo del componente existente para evitar cambios innecesarios.

### Paso 4: Reordenar el arreglo local

```ts
drop(event: CdkDragDrop<LaneResponse[]>): void {
  moveItemInArray(this.lanes, event.previousIndex, event.currentIndex);
}
```

Esto solo reordena el arreglo en memoria del frontend.

### Paso 5: Persistir el nuevo orden solo si el backend tiene endpoint

No se debe inventar endpoint.

Si el backend ya tiene soporte para guardar posiciones, el flujo podria usar `orderIndex` en lanes:

```ts
drop(event: CdkDragDrop<LaneResponse[]>): void {
  moveItemInArray(this.lanes, event.previousIndex, event.currentIndex);

  const orderedLanes = this.lanes.map((lane, index) => ({
    id: lane.id,
    orderIndex: index + 1
  }));

  // Requiere endpoint real definido con backend.
  // this.laneService.updateLaneOrder(poolId, orderedLanes).subscribe({
  //   error: () => {
  //     moveItemInArray(this.lanes, event.currentIndex, event.previousIndex);
  //   }
  // });
}
```

Si el backend no tiene endpoint de ordenamiento, la implementacion debe quedar solo como reordenamiento visual local o debe dejarse pendiente.

## Estrategia por fases

### Fase 1: Drag and Drop visual/local

- Implementar Drag and Drop sin persistencia backend.
- Reordenar solo el arreglo local con `moveItemInArray`.
- Validar UX y pruebas unitarias.
- No alterar datos del backend.

### Fase 2: Aplicar local primero en Lanes o en un listado simple

- Implementar Drag and Drop en una lista simple y no critica.
- Primer candidato recomendado: lanes, porque el backend ya contempla `orderIndex`.
- Mantener reordenamiento local.
- No alterar datos de backend.
- No persistir orden si no existe contrato backend.
- Agregar tests del metodo `drop`.
- Validar que no afecte listado, filtros, formularios ni navegacion.

### Fase 3: Persistencia parcial de lanes con lo existente

- Usar `PUT /api/lanes/{id}` como solucion temporal si el equipo decide persistir antes de crear endpoint bulk.
- Enviar el objeto completo de cada lane con `orderIndex` actualizado.
- Aclarar que esto no es transaccional.
- Hacer rollback visual si falla alguna actualizacion.
- No aplicar este enfoque a procesos, usuarios, roles, pools ni flows.

### Fase 4: Persistencia robusta con cambio backend

Propuesta backend:

- Crear DTO `LaneOrderRequest { id, orderIndex }`.
- Crear endpoint `PATCH /api/lanes/reorder` o `PUT /api/lanes/order`.
- Implementar metodo transaccional para actualizar todas las lanes del pool.
- Hacer que `GET /api/lanes?poolId=...` retorne ordenado por `orderIndex`.
- Validar unicidad y consistencia de `orderIndex` dentro de un pool.
- Agregar tests backend del reordenamiento.

Despues de esa fase, frontend podria persistir lanes con una sola llamada batch.

## Propuesta de aplicacion en Organizapp

Primera fase recomendada:

- Implementar Drag and Drop local/visual.
- Primer candidato: lanes.
- No alterar datos de backend.
- No persistir orden salvo decision explicita del equipo.
- Agregar tests del metodo `drop`.
- Validar que no afecte listado, filtros, formularios ni navegacion.

Segunda fase recomendada:

- Si se persiste, hacerlo solo para lanes.
- Usar `orderIndex` solo si el frontend ya tiene el campo en sus modelos.
- Evitar inventar endpoint frontend.
- Preferir cambio backend robusto antes que `PUT` individual masivo.
- Implementar rollback visual si falla la persistencia.
- Mostrar error con `ApiErrorService`.

Posibles modulos candidatos:

- Lanes: reordenar lanes dentro de un pool.
- Nodes: reordenar nodos dentro de una version de proceso.
- Flows: ordenar pasos o relaciones visuales si el modelo lo permite.
- Listados administrativos: solo si el orden tiene significado funcional.

No implementar persistencia general de orden para processes, users, roles o pools.

## Consideraciones de UX

Para evitar una experiencia confusa:

- Mantener un layout estable: el alto de cada item no debe saltar durante el drag.
- Evitar que textos, botones o inputs cambien el tamano del item mientras se arrastra.
- Agregar un icono o zona de agarre si no toda la fila debe ser arrastrable.
- Usar `cdkDragHandle` cuando el elemento tenga botones, links o inputs.
- Evitar drag and drop en filas con formularios activos.
- Mantener feedback visual durante el arrastre.
- Usar placeholder para mostrar donde caera el elemento.
- Evitar que un click normal dispare arrastre accidentalmente.

Ejemplo con handle:

```html
<div class="sortable-item" cdkDrag>
  <button type="button" cdkDragHandle aria-label="Arrastrar elemento">
    ::
  </button>

  <span>{{ item.name }}</span>
</div>
```

## Estilos base sugeridos

```css
.sortable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sortable-item {
  cursor: move;
  background: #fff;
  border: 1px solid #d8dde6;
  border-radius: 6px;
  padding: 12px;
}

.cdk-drag-preview {
  box-sizing: border-box;
  border-radius: 6px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
}

.cdk-drag-placeholder {
  opacity: 0.35;
}

.cdk-drag-animating,
.sortable-list.cdk-drop-list-dragging .sortable-item:not(.cdk-drag-placeholder) {
  transition: transform 180ms cubic-bezier(0, 0, 0.2, 1);
}
```

## Pruebas recomendadas

Para el componente:

- Se crea correctamente.
- Renderiza la lista inicial.
- `drop()` llama `moveItemInArray` indirectamente al cambiar el orden del arreglo.
- Si se mueve el elemento de indice 0 a indice 2, el arreglo queda en el orden esperado.
- Si existe persistencia backend, llama el servicio con IDs y posiciones.
- Si falla la persistencia, revierte el orden local.
- No rompe botones internos ni navegacion.

Ejemplo de test unitario simple:

```ts
it('should reorder items on drop', () => {
  component.items = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' }
  ];

  component.drop({
    previousIndex: 0,
    currentIndex: 2
  } as CdkDragDrop<ItemResponse[]>);

  expect(component.items.map((item) => item.id)).toEqual([2, 3, 1]);
});
```

## Riesgos y reglas

- No inventar endpoints de backend para persistir orden.
- No guardar posiciones si el backend no tiene contrato claro.
- No romper filtros existentes.
- No mezclar reordenamiento local con paginacion sin definir comportamiento.
- No permitir arrastrar elementos mientras se esta guardando.
- No ocultar errores de persistencia.
- No usar librerias externas de drag and drop sin justificarlo.
- No implementar Drag and Drop en formularios complejos sin validar accesibilidad.

## Decision tecnica inicial

Para Organizapp, la primera implementacion debe usar Angular CDK DragDrop con reordenamiento dentro de una misma lista:

- `cdkDropList` en el contenedor.
- `cdkDrag` en cada elemento.
- `(cdkDropListDropped)="drop($event)"`.
- `CdkDragDrop<T[]>` como tipo del evento.
- `moveItemInArray` para actualizar el arreglo local.

La primera fase es local y no altera datos del backend.

La persistencia del nuevo orden queda condicionada a que backend defina un contrato explicito. Para lanes, el ejemplo natural es guardar `orderIndex`; aun asi, hoy la persistencia robusta requiere mejorar backend con un endpoint batch y una consulta ordenada por `orderIndex`.

## Decision recomendada para Organizapp

- Primera implementacion: local/visual.
- Primer candidato recomendado: lanes, porque existe `orderIndex`.
- No persistir todavia salvo decision explicita del equipo.
- Si se persiste, hacerlo solo para lanes y dejando documentada la limitacion de `PUT /api/lanes/{id}`.
- No inventar endpoint frontend.
- No implementar persistencia de orden para procesos, usuarios, roles o pools.
- Para nodes, tratar Drag and Drop como movimiento en canvas usando coordenadas, no como orden de lista.

## Criterios para pasar a implementacion

Checklist:

- `@angular/cdk` instalado.
- Documento actualizado y revisado por el equipo.
- Modulo elegido para la primera implementacion.
- Decision tomada: local/visual o persistente.
- Si es persistente, contrato backend confirmado.
- Si es persistente en lanes, confirmar `orderIndex` en modelos frontend.
- Si es persistente robusto, endpoint backend definido y probado.
- Tests frontend definidos.
- No hay cambios backend no coordinados.
- No se inventan endpoints desde frontend.

## Referencias

- Angular Drag and Drop guide: https://angular.dev/guide/drag-drop
- Angular CDK DragDrop API: https://material.angular.dev/cdk/drag-drop/api
