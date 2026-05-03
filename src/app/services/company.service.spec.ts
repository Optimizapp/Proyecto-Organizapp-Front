import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { CompanyService } from './company.service';
import { RegisterCompanyRequest, RegisterCompanyResponse } from '../core/models';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

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
