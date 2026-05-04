import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { RoleRequest, RoleResponse } from '../core/models';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  const role: RoleResponse = {
    id: 1,
    name: 'MANAGER',
    companyId: 7,
    processId: 3
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get roles using companyId query', () => {
    service.getRoles({ companyId: 7 }).subscribe((roles) => {
      expect(roles).toEqual([role]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/roles` &&
      request.params.get('companyId') === '7'
    );
    expect(req.request.method).toBe('GET');
    req.flush([role]);
  });

  it('should get roles using companyId and processId query params', () => {
    service.getRoles({ companyId: 7, processId: 3 }).subscribe((roles) => {
      expect(roles).toEqual([role]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/roles` &&
      request.params.get('companyId') === '7' &&
      request.params.get('processId') === '3'
    );
    expect(req.request.method).toBe('GET');
    req.flush([role]);
  });

  it('should create a role', () => {
    const request: RoleRequest = {
      name: 'MANAGER',
      companyId: 7,
      processId: 3
    };

    service.createRole(request).subscribe((result) => {
      expect(result).toEqual(role);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(role);
  });

  it('should update a role', () => {
    const request: RoleRequest = {
      name: 'OWNER',
      companyId: 7,
      processId: 3
    };
    const response: RoleResponse = { ...role, name: 'OWNER' };

    service.updateRole(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a role', () => {
    service.deleteRole(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
