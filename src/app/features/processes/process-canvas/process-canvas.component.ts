import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

type CanvasNodeType = 'task' | 'event' | 'gateway';

interface CanvasPool {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasLane {
  id: number;
  poolId: number;
  name: string;
  y: number;
  height: number;
}

interface CanvasNode {
  id: number;
  laneId: number;
  type: CanvasNodeType;
  label: string;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
}

interface Connection {
  sourceId: number;
  targetId: number;
}

type ConnectionAnchor = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const NODE_TYPE_LABELS: Record<CanvasNodeType, string> = {
  task: 'Tarea',
  event: 'Evento',
  gateway: 'Decisión'
};

const SNAP_GRID = 20;

@Component({
  selector: 'app-process-canvas',
  standalone: true,
  imports: [CommonModule, RouterModule, CdkDrag],
  templateUrl: './process-canvas.component.html',
  styleUrl: './process-canvas.component.css'
})
export class ProcessCanvasComponent {
  readonly zoom = 1;
  readonly canvasSize = {
    width: 1800,
    height: 1100
  };

  readonly pools: CanvasPool[] = [
    {
      id: 1,
      name: 'Proceso comercial',
      x: 72,
      y: 72,
      width: 1500,
      height: 620
    }
  ];

  readonly lanes: CanvasLane[] = [
    {
      id: 11,
      poolId: 1,
      name: 'Ventas',
      y: 0,
      height: 205
    },
    {
      id: 12,
      poolId: 1,
      name: 'Aprobacion',
      y: 205,
      height: 205
    },
    {
      id: 13,
      poolId: 1,
      name: 'Operacion',
      y: 410,
      height: 210
    }
  ];

  nodes: CanvasNode[] = [
    {
      id: 101,
      laneId: 11,
      type: 'event',
      label: 'Solicitud recibida',
      position: { x: 220, y: 138 },
      width: 88,
      height: 88
    },
    {
      id: 102,
      laneId: 11,
      type: 'task',
      label: 'Registrar oportunidad',
      position: { x: 430, y: 130 },
      width: 180,
      height: 92
    },
    {
      id: 103,
      laneId: 12,
      type: 'gateway',
      label: '¿Requiere aprobación?',
      position: { x: 725, y: 335 },
      width: 112,
      height: 112
    },
    {
      id: 104,
      laneId: 13,
      type: 'task',
      label: 'Preparar entrega',
      position: { x: 1030, y: 545 },
      width: 180,
      height: 92
    }
  ];

  readonly connections: Connection[] = [
    { sourceId: 101, targetId: 102 },
    { sourceId: 102, targetId: 103 },
    { sourceId: 103, targetId: 104 }
  ];

  selectedNode: CanvasNode | null = null;

  readonly displayMode = 'Edición local';

  get nodeCount(): number {
    return this.nodes.length;
  }

  get connectionCount(): number {
    return this.connections.length;
  }

  getLanesForPool(poolId: number): CanvasLane[] {
    return this.lanes.filter((lane) => lane.poolId === poolId);
  }

  getNodePool(node: CanvasNode): CanvasPool | undefined {
    const lane = this.lanes.find((l) => l.id === node.laneId);
    if (!lane) return undefined;
    return this.pools.find((p) => p.id === lane.poolId);
  }

  getNodeLane(node: CanvasNode): CanvasLane | undefined {
    return this.lanes.find((l) => l.id === node.laneId);
  }

  getNodeTypeLabel(type: CanvasNodeType): string {
    return NODE_TYPE_LABELS[type] ?? type;
  }

  onNodeClick(node: CanvasNode): void {
    this.selectedNode = node;
  }

  getNodeAriaLabel(node: CanvasNode): string {
    return 'Nodo: ' + node.label + ' (' + this.getNodeTypeLabel(node.type) + ')';
  }

  isNodeSelected(node: CanvasNode): boolean {
    return this.selectedNode?.id === node.id;
  }

  onCanvasClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('canvas-surface')) {
      this.selectedNode = null;
    }
  }

  onNodeDragEnded(node: CanvasNode, event: CdkDragEnd): void {
    const raw = event.source.getFreeDragPosition();
    node.position = {
      x: this.snap(raw.x),
      y: this.snap(raw.y)
    };
  }

  /** Redondea al múltiplo de 20 más cercano (snap visual). */
  private snap(value: number): number {
    return Math.round(value / SNAP_GRID) * SNAP_GRID;
  }

  /* ------------------------------------------------------------------ */
  /*  SVG connection helpers                                              */
  /* ------------------------------------------------------------------ */

  private getNodeCenterX(node: CanvasNode): number {
    return node.position.x + node.width / 2;
  }

  private getNodeCenterY(node: CanvasNode): number {
    return node.position.y + node.height / 2;
  }

  /**
   * Calcula los puntos de anclaje entre dos nodos.
   * Elige el lado de salida/entrada según la dirección predominante.
   */
  private getConnectionAnchors(source: CanvasNode, target: CanvasNode): ConnectionAnchor {
    const cx1 = this.getNodeCenterX(source);
    const cy1 = this.getNodeCenterY(source);
    const cx2 = this.getNodeCenterX(target);
    const cy2 = this.getNodeCenterY(target);

    const dx = cx2 - cx1;
    const dy = cy2 - cy1;

    let x1: number, y1: number, x2: number, y2: number;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Predominantemente horizontal
      if (dx > 0) {
        x1 = source.position.x + source.width;
        y1 = cy1;
        x2 = target.position.x;
        y2 = cy2;
      } else {
        x1 = source.position.x;
        y1 = cy1;
        x2 = target.position.x + target.width;
        y2 = cy2;
      }
    } else {
      // Predominantemente vertical
      if (dy > 0) {
        x1 = cx1;
        y1 = source.position.y + source.height;
        x2 = cx2;
        y2 = target.position.y;
      } else {
        x1 = cx1;
        y1 = source.position.y;
        x2 = cx2;
        y2 = target.position.y + target.height;
      }
    }

    return { x1, y1, x2, y2 };
  }

  /**
   * Genera un path SVG de curva cúbica suave.
   * Usa un factor de 0.33 para curvas más contenidas y limpias.
   */
  private buildPath(source: CanvasNode, target: CanvasNode): string {
    const { x1, y1, x2, y2 } = this.getConnectionAnchors(source, target);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const factor = 0.33;
    const cp1x = x1 + dx * factor;
    const cp1y = y1;
    const cp2x = x2 - dx * factor;
    const cp2y = y2;
    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  /**
   * Devuelve los datos de las líneas para el template.
   * Se recalcula en cada detección de cambios (tras drag, etc.).
   */
  getConnectionPaths(): Array<{ d: string; sourceId: number; targetId: number }> {
    const result: Array<{ d: string; sourceId: number; targetId: number }> = [];
    for (const conn of this.connections) {
      const source = this.nodes.find((n) => n.id === conn.sourceId);
      const target = this.nodes.find((n) => n.id === conn.targetId);
      if (!source || !target) continue;
      result.push({
        d: this.buildPath(source, target),
        sourceId: conn.sourceId,
        targetId: conn.targetId,
      });
    }
    return result;
  }

  readonly markerId = 'conn-arrowhead';
}