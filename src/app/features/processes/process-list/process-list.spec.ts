import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { ProcessList } from './process-list';
import { ProcessService } from '../process.service';
import { Process, ProcessResponse, ProcessStatus } from '../models/process.model';

describe('ProcessList', () => {
  let component: ProcessList;
  let fixture: ComponentFixture<ProcessList>;
  let getProcessesSpy: ReturnType<typeof vi.fn>;

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
    }
  ];

  async function createComponent(response$: Observable<ProcessResponse[]> = of(processes)): Promise<void> {
    getProcessesSpy = vi.fn((_companyId?: number, _status?: ProcessStatus) => response$);

    await TestBed.configureTestingModule({
      imports: [ProcessList],
      providers: [
        provideRouter([]),
        { provide: ProcessService, useValue: { getProcesses: getProcessesSpy } }
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
    expect(getProcessesSpy).toHaveBeenCalledWith(undefined, undefined);
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

    expect(getProcessesSpy).toHaveBeenLastCalledWith(undefined, undefined);
    expect(component.filteredProcesses).toEqual([processes[0]]);
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

    expect(getProcessesSpy).toHaveBeenLastCalledWith(undefined, 'ACTIVE');
    expect(component.filteredProcesses).toEqual([processes[0]]);
  });

  it('should clear filters and reload the complete process list', async () => {
    await createComponent();

    component.nameFilter = 'ventas';
    component.statusFilter = 'ACTIVE';
    component.clearFilters();

    expect(component.nameFilter).toBe('');
    expect(component.statusFilter).toBe('');
    expect(getProcessesSpy).toHaveBeenLastCalledWith(undefined, undefined);
    expect(component.filteredProcesses).toEqual(processes);
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
