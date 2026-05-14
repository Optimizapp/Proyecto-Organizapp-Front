import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { ProcessList } from './process-list';
import { ProcessService } from '../process.service';
import { Process, ProcessResponse, ProcessStatus } from '../models/process.model';

describe('ProcessList', () => {
  let component: ProcessList;
  let fixture: ComponentFixture<ProcessList>;
  let processServiceMock: {
    getProcesses: ReturnType<typeof vi.fn>;
    updateProcess: ReturnType<typeof vi.fn>;
  };

  const processes: Process[] = [
    {
      id: 1,
      name: 'Proceso de ventas',
      description: 'Flujo comercial',
      status: 'ACTIVE',
      companyId: 1,
      userId: 1,
      mainPoolId: 1
    },
    {
      id: 2,
      name: 'Proceso de compras',
      description: 'Flujo de abastecimiento',
      status: 'DRAFT',
      companyId: 1,
      userId: 1,
      mainPoolId: 1
    },
    {
      id: 3,
      name: 'Onboarding interno',
      description: 'Flujo de talento',
      status: 'ACTIVE',
      companyId: 1,
      userId: 1,
      mainPoolId: 1
    }
  ];

  async function createComponent(response$: Observable<ProcessResponse[]> = of(processes)): Promise<void> {
    processServiceMock = {
      getProcesses: vi.fn((_companyId?: number, _status?: ProcessStatus) => response$),
      updateProcess: vi.fn(() => of(processes[0]))
    };

    await TestBed.configureTestingModule({
      imports: [ProcessList],
      providers: [
        provideRouter([]),
        { provide: ProcessService, useValue: processServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and request the process list on init', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(processServiceMock.getProcesses).toHaveBeenCalledWith(undefined, undefined);
    expect(component.processes).toEqual(processes);
    expect(component.filteredProcesses).toEqual(processes);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should stop loading and render processes when the service emits data', async () => {
    const response$ = new Subject<ProcessResponse[]>();
    await createComponent(response$);

    expect(component.isLoading).toBe(true);

    response$.next(processes);
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.processes).toEqual(processes);
    expect(component.filteredProcesses).toEqual(processes);
    expect(fixture.nativeElement.textContent).toContain('Proceso de ventas');
    expect(fixture.nativeElement.textContent).toContain('Proceso de compras');
  });

  it('should filter processes by name locally after loading data', async () => {
    await createComponent();

    component.nameFilter = 'ventas';
    component.applyFilters();

    expect(processServiceMock.getProcesses).toHaveBeenLastCalledWith(undefined, undefined);
    expect(component.filteredProcesses).toEqual([processes[0]]);
  });

  it('should reorder visible processes locally without backend requests', async () => {
    await createComponent();
    component.filteredProcesses = [...processes];
    vi.clearAllMocks();

    component.dropProcess({
      previousIndex: 0,
      currentIndex: 2
    } as CdkDragDrop<Process[]>);

    expect(component.filteredProcesses.map((process) => process.id)).toEqual([2, 3, 1]);
    expect(component.processes.map((process) => process.id)).toEqual([1, 2, 3]);
    expect(processServiceMock.getProcesses).not.toHaveBeenCalled();
    expect(processServiceMock.updateProcess).not.toHaveBeenCalled();
  });

  it('should reorder the filtered process list without breaking filter reset', async () => {
    await createComponent();

    component.nameFilter = 'proceso';
    component.applyFilters();

    expect(component.filteredProcesses.map((process) => process.id)).toEqual([1, 2]);
    vi.clearAllMocks();

    component.dropProcess({
      previousIndex: 0,
      currentIndex: 1
    } as CdkDragDrop<Process[]>);

    expect(component.filteredProcesses.map((process) => process.id)).toEqual([2, 1]);
    expect(processServiceMock.getProcesses).not.toHaveBeenCalled();
    expect(processServiceMock.updateProcess).not.toHaveBeenCalled();

    component.clearFilters();

    expect(component.nameFilter).toBe('');
    expect(component.filteredProcesses.map((process) => process.id)).toEqual([1, 2, 3]);
    expect(processServiceMock.getProcesses).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should expose navigation links for creating, viewing and editing processes', async () => {
    await createComponent();

    const compiled: HTMLElement = fixture.nativeElement;

    expect(compiled.textContent).toContain('Nuevo proceso');
    expect(compiled.textContent).toContain('Ver detalle');
    expect(compiled.textContent).toContain('Editar');
  });

  it('should request processes with the selected status as backend query param', async () => {
    await createComponent(of([processes[0]]));

    component.statusFilter = 'ACTIVE';
    component.applyFilters();

    expect(processServiceMock.getProcesses).toHaveBeenLastCalledWith(undefined, 'ACTIVE');
    expect(component.filteredProcesses).toEqual([processes[0]]);
  });

  it('should clear filters and reload the complete process list', async () => {
    await createComponent();

    component.nameFilter = 'ventas';
    component.statusFilter = 'ACTIVE';
    component.clearFilters();

    expect(component.nameFilter).toBe('');
    expect(component.statusFilter).toBe('');
    expect(processServiceMock.getProcesses).toHaveBeenLastCalledWith(undefined, undefined);
    expect(component.filteredProcesses).toEqual(processes);
  });

  it('should render the local order warning and accessible drag handles when processes are visible', async () => {
    await createComponent();

    const compiled: HTMLElement = fixture.nativeElement;
    const handles = compiled.querySelectorAll('button.drag-handle[cdkDragHandle][aria-label="Mover proceso"]');

    expect(compiled.textContent).toContain('El orden se actualiza solo visualmente en esta versión.');
    expect(handles.length).toBe(processes.length);
  });

  it('should hide the local order warning when there are no processes', async () => {
    await createComponent(of([]));

    expect(fixture.nativeElement.textContent).not.toContain('El orden se actualiza solo visualmente en esta versión.');
  });

  it('should show an empty state when there are no processes', async () => {
    await createComponent(of([]));

    expect(component.processes).toEqual([]);
    expect(component.filteredProcesses).toEqual([]);
    expect(component.error).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No hay procesos disponibles para mostrar.');
  });

  it('should keep the list empty and expose backend errors', async () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });

    await createComponent(throwError(() => error));

    expect(component.processes).toEqual([]);
    expect(component.filteredProcesses).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('El servidor no pudo procesar la solicitud. Intenta nuevamente mas tarde.');
  });
});
