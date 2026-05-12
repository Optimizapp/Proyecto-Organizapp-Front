import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { CompanyResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { CompanyList } from './company-list';

describe('CompanyList', () => {
  let component: CompanyList;
  let fixture: ComponentFixture<CompanyList>;
  let getCompaniesSpy: ReturnType<typeof vi.fn>;

  const companies: CompanyResponse[] = [
    {
      id: 1,
      name: 'Acme',
      nit: '123',
      address: 'Main street',
      phone: '555',
      industry: 'Technology'
    },
    {
      id: 2,
      name: 'Globex',
      nit: '456',
      address: 'Second street',
      phone: '777'
    }
  ];

  async function createComponent(response$: Observable<CompanyResponse[]> = of(companies)): Promise<void> {
    getCompaniesSpy = vi.fn(() => response$);

    await TestBed.configureTestingModule({
      imports: [CompanyList],
      providers: [
        provideRouter([]),
        { provide: CompanyService, useValue: { getCompanies: getCompaniesSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and request the company list on init', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(getCompaniesSpy).toHaveBeenCalled();
    expect(component.companies).toEqual(companies);
    expect(component.error).toBeNull();
  });

  it('should render companies returned by the backend', async () => {
    await createComponent();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Acme');
    expect(text).toContain('123');
    expect(text).toContain('Technology');
    expect(text).toContain('Globex');
  });

  it('should show an empty state when there are no companies', async () => {
    await createComponent(of([]));

    expect(component.companies).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No hay empresas registradas para mostrar.');
  });

  it('should expose backend errors through ApiErrorService', async () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });

    await createComponent(throwError(() => error));

    expect(component.companies).toEqual([]);
    expect(component.error).toBe('El servidor no pudo procesar la solicitud. Intenta nuevamente mas tarde.');
  });

  it('should expose navigation links for creating and editing companies', async () => {
    await createComponent();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Nueva empresa');
    expect(text).toContain('Editar');
  });
});
