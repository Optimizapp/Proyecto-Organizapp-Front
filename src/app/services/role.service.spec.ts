import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

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
      expect(roles).toEqual([]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/roles` &&
      request.params.get('companyId') === '7'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
