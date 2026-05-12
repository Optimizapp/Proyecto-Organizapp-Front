import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CompanyResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { CompanyFormComponent } from './company-form.component';

describe('CompanyFormComponent', () => {
  let component: CompanyFormComponent;
  let fixture: ComponentFixture<CompanyFormComponent>;
  let router: Router;
  let companyServiceMock: {
    getCompanyById: ReturnType<typeof vi.fn>;
    createCompany: ReturnType<typeof vi.fn>;
    updateCompany: ReturnType<typeof vi.fn>;
  };

  const company: CompanyResponse = {
    id: 1,
    name: 'Acme',
    nit: '123',
    address: 'Main street',
    phone: '555',
    industry: 'Technology'
  };

  async function createComponent(id?: string): Promise<void> {
    companyServiceMock = {
      getCompanyById: vi.fn(() => of(company)),
      createCompany: vi.fn(() => of(company)),
      updateCompany: vi.fn(() => of(company))
    };

    await TestBed.configureTestingModule({
      imports: [CompanyFormComponent],
      providers: [
        provideRouter([]),
        { provide: CompanyService, useValue: companyServiceMock },
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

    fixture = TestBed.createComponent(CompanyFormComponent);
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
    expect(companyServiceMock.getCompanyById).not.toHaveBeenCalled();
  });

  it('should not submit an invalid form', async () => {
    await createComponent();

    component.companyForm.patchValue({ name: '', nit: '', address: '', phone: '' });
    component.saveCompany();

    expect(component.companyForm.invalid).toBe(true);
    expect(companyServiceMock.createCompany).not.toHaveBeenCalled();
    expect(companyServiceMock.updateCompany).not.toHaveBeenCalled();
  });

  it('should call createCompany in create mode', async () => {
    await createComponent();

    component.companyForm.setValue({
      name: 'Nueva empresa',
      nit: '900',
      address: 'Calle 1',
      phone: '300',
      industry: 'Servicios'
    });
    component.saveCompany();

    expect(companyServiceMock.createCompany).toHaveBeenCalledWith({
      name: 'Nueva empresa',
      nit: '900',
      address: 'Calle 1',
      phone: '300',
      industry: 'Servicios'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/companies']);
  });

  it('should load a company and call updateCompany in edit mode', async () => {
    await createComponent('1');

    expect(component.isEditMode).toBe(true);
    expect(companyServiceMock.getCompanyById).toHaveBeenCalledWith(1);
    expect(component.companyForm.value.name).toBe('Acme');

    component.companyForm.patchValue({ name: 'Acme Updated' });
    component.saveCompany();

    expect(companyServiceMock.updateCompany).toHaveBeenCalledWith(1, {
      name: 'Acme Updated',
      nit: '123',
      address: 'Main street',
      phone: '555',
      industry: 'Technology'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/companies']);
  });

  it('should expose backend errors through ApiErrorService', async () => {
    const backendError = new HttpErrorResponse({
      status: 409,
      statusText: 'Conflict',
      error: {
        timestamp: '2026-05-11T00:00:00.000Z',
        status: 409,
        error: 'Conflict',
        message: 'La empresa ya existe',
        path: '/api/companies',
        fields: {
          nit: 'El NIT ya esta registrado'
        }
      }
    });

    await createComponent();
    companyServiceMock.createCompany.mockReturnValue(throwError(() => backendError));
    component.companyForm.setValue({
      name: 'Nueva empresa',
      nit: '900',
      address: 'Calle 1',
      phone: '300',
      industry: ''
    });

    component.saveCompany();

    expect(component.error).toBe('La empresa ya existe');
    expect(component.fieldErrors).toEqual({ nit: 'El NIT ya esta registrado' });
  });
});
