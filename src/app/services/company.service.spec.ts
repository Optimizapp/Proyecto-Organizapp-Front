import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import {
  CompanyResponse,
  CreateCompanyRequest,
  RegisterCompanyRequest,
  RegisterCompanyResponse,
  UpdateCompanyRequest
} from '../core/models';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  const company: CompanyResponse = {
    id: 1,
    name: 'Acme',
    nit: '123',
    address: 'Main street',
    phone: '555',
    industry: 'Technology'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get companies', () => {
    service.getCompanies().subscribe((companies) => {
      expect(companies).toEqual([company]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies`);
    expect(req.request.method).toBe('GET');
    req.flush([company]);
  });

  it('should get a company by id', () => {
    service.getCompanyById(1).subscribe((result) => {
      expect(result).toEqual(company);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies/1`);
    expect(req.request.method).toBe('GET');
    req.flush(company);
  });

  it('should create a company', () => {
    const request: CreateCompanyRequest = {
      name: 'Acme',
      nit: '123',
      address: 'Main street',
      phone: '555',
      industry: 'Technology'
    };

    service.createCompany(request).subscribe((result) => {
      expect(result).toEqual(company);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(company);
  });

  it('should update a company', () => {
    const request: UpdateCompanyRequest = {
      name: 'Acme Updated',
      phone: '777'
    };
    const response: CompanyResponse = { ...company, ...request };

    service.updateCompany(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a company', () => {
    service.deleteCompany(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should register a company using POST /companies/register', () => {
    const request: RegisterCompanyRequest = {
      name: 'Acme',
      nit: '123',
      address: 'Main street',
      phone: '555',
      adminName: 'Admin',
      adminEmail: 'admin@acme.com'
    };
    const response: RegisterCompanyResponse = {
      company: { id: 1, name: 'Acme', nit: '123', address: 'Main street', phone: '555' },
      adminUser: { id: 1, name: 'Admin', email: 'admin@acme.com', companyId: 1, roleId: 1, active: true },
      roles: [{ id: 1, name: 'ADMIN', companyId: 1, processId: null }],
      defaultPool: { id: 1, name: 'Main Pool', companyId: 1 }
    };

    service.registerCompany(request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/companies/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });
});
