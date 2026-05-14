import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProcessCanvasComponent } from './process-canvas.component';

describe('ProcessCanvasComponent', () => {
  let component: ProcessCanvasComponent;
  let fixture: ComponentFixture<ProcessCanvasComponent>;

  async function createComponent(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [ProcessCanvasComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render the visual canvas shell', async () => {
    await createComponent();

    const compiled: HTMLElement = fixture.nativeElement;

    expect(compiled.querySelector('.designer-sidebar')).not.toBeNull();
    expect(compiled.querySelector('.canvas-surface')).not.toBeNull();
    expect(compiled.querySelector('.properties-panel')).not.toBeNull();
    expect(compiled.textContent).toContain('Canvas de proceso');
  });

  it('should render mock pools and lanes', async () => {
    await createComponent();

    const compiled: HTMLElement = fixture.nativeElement;

    expect(compiled.querySelectorAll('.pool').length).toBe(component.pools.length);
    expect(compiled.querySelectorAll('.lane').length).toBe(component.lanes.length);
    expect(compiled.textContent).toContain('Proceso comercial');
    expect(compiled.textContent).toContain('Ventas');
    expect(compiled.textContent).toContain('Aprobacion');
  });

  it('should render simplified BPMN nodes', async () => {
    await createComponent();

    const compiled: HTMLElement = fixture.nativeElement;

    expect(compiled.querySelectorAll('.canvas-node').length).toBe(component.nodes.length);
    expect(compiled.querySelector('.task-node')).not.toBeNull();
    expect(compiled.querySelector('.event-node')).not.toBeNull();
    expect(compiled.querySelector('.gateway-node')).not.toBeNull();
    expect(compiled.textContent).toContain('Registrar oportunidad');
  });

  it('should update node position locally after drag ends', async () => {
    await createComponent();
    const node = component.nodes[0];

    component.onNodeDragEnded(node, {
      source: {
        getFreeDragPosition: () => ({ x: 320, y: 240 })
      }
    } as CdkDragEnd);

    expect(node.position).toEqual({ x: 320, y: 240 });
  });
});
