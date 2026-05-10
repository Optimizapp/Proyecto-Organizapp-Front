import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { PermissionRequest, PermissionResponse } from '../core/models';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let httpMock: HttpTestingController;

  const permission: PermissionResponse = {
    id: 1,
    roleId: 2,
    name: 'PROCESS_READ',
    description: 'Read processes'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PermissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get permissions without filters', () => {
    service.getPermissions().subscribe((permissions) => {
      expect(permissions).toEqual([permission]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/permissions`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys()).toEqual([]);
    req.flush([permission]);
  });

  it('should get permissions using roleId query', () => {
    service.getPermissions(2).subscribe((permissions) => {
      expect(permissions).toEqual([permission]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/permissions` &&
      request.params.get('roleId') === '2'
    );
    expect(req.request.method).toBe('GET');
    req.flush([permission]);
  });

  it('should create a permission', () => {
    const request: PermissionRequest = {
      roleId: 2,
      name: 'PROCESS_READ',
      description: 'Read processes'
    };

    service.createPermission(request).subscribe((result) => {
      expect(result).toEqual(permission);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/permissions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(permission);
  });

  it('should delete a permission', () => {
    service.deletePermission(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/permissions/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
