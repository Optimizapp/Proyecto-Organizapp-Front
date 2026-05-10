import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProcessForm } from './process-form';
import { ProcessService } from '../process.service';
import { ProcessResponse } from '../models/process.model';

describe('ProcessForm', () => {
  let component: ProcessForm;
  let fixture: ComponentFixture<ProcessForm>;
  let router: Router;
  let processServiceMock: {
    getProcessById: ReturnType<typeof vi.fn>;
    createProcess: ReturnType<typeof vi.fn>;
    updateProcess: ReturnType<typeof vi.fn>;
  };

  const process: ProcessResponse = {
    id: 1,
    name: 'Proceso de ventas',
    description: 'Flujo comercial',
    category: 'Ventas',
    status: 'ACTIVE',
    companyId: 1,
    userId: 2,
    mainPoolId: 3
  };

  async function createComponent(id?: string): Promise<void> {
    processServiceMock = {
      getProcessById: vi.fn(() => of(process)),
      createProcess: vi.fn(() => of(process)),
      updateProcess: vi.fn(() => of(process))
    };

    await TestBed.configureTestingModule({
      imports: [ProcessForm],
      providers: [
        provideRouter([]),
        { provide: ProcessService, useValue: processServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(id ? { id } : {})
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ProcessForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create in create mode', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
    expect(processServiceMock.getProcessById).not.toHaveBeenCalled();
  });

  it('should call createProcess when the create form is valid', async () => {
    await createComponent();

    component.processForm.setValue({
      name: 'Proceso nuevo',
      description: 'Descripcion',
      category: 'Operaciones',
      status: 'DRAFT',
      companyId: 1,
      userId: 2,
      mainPoolId: 3
    });
    component.saveProcess();

    expect(processServiceMock.createProcess).toHaveBeenCalledWith({
      name: 'Proceso nuevo',
      description: 'Descripcion',
      category: 'Operaciones',
      status: 'DRAFT',
      companyId: 1,
      userId: 2,
      mainPoolId: 3
    });
    expect(router.navigate).toHaveBeenCalledWith(['/processes', process.id]);
  });

  it('should load the process and call updateProcess in edit mode', async () => {
    await createComponent('1');

    expect(component.isEditMode).toBe(true);
    expect(processServiceMock.getProcessById).toHaveBeenCalledWith(1);
    expect(component.processForm.value.name).toBe('Proceso de ventas');

    component.processForm.patchValue({ name: 'Proceso actualizado' });
    component.saveProcess();

    expect(processServiceMock.updateProcess).toHaveBeenCalledWith(1, {
      name: 'Proceso actualizado',
      description: 'Flujo comercial',
      category: 'Ventas',
      status: 'ACTIVE',
      companyId: 1,
      userId: 2,
      mainPoolId: 3
    });
    expect(router.navigate).toHaveBeenCalledWith(['/processes', process.id]);
  });

  it('should not submit an invalid form', async () => {
    await createComponent();

    component.processForm.patchValue({
      name: '',
      companyId: null,
      userId: null,
      mainPoolId: null
    });
    component.saveProcess();

    expect(component.processForm.invalid).toBe(true);
    expect(processServiceMock.createProcess).not.toHaveBeenCalled();
    expect(processServiceMock.updateProcess).not.toHaveBeenCalled();
  });

  it('should expose backend errors through ApiErrorService', async () => {
    const backendError = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: {
        timestamp: '2026-05-09T00:00:00.000Z',
        status: 400,
        error: 'Bad Request',
        message: 'Datos invalidos',
        path: '/api/processes',
        fields: {
          name: 'El nombre es obligatorio'
        }
      }
    });

    await createComponent();
    processServiceMock.createProcess.mockReturnValue(throwError(() => backendError));
    component.processForm.setValue({
      name: 'Proceso nuevo',
      description: '',
      category: '',
      status: 'DRAFT',
      companyId: 1,
      userId: 2,
      mainPoolId: 3
    });

    component.saveProcess();

    expect(component.error).toBe('Datos invalidos');
    expect(component.fieldErrors).toEqual({ name: 'El nombre es obligatorio' });
  });
});
