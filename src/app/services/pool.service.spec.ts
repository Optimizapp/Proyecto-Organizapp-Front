import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { CreatePoolRequest, PoolResponse, UpdatePoolRequest } from '../core/models';
import { PoolService } from './pool.service';

describe('PoolService', () => {
  let service: PoolService;
  let httpMock: HttpTestingController;

  const pool: PoolResponse = {
    id: 1,
    name: 'Main Pool',
    companyId: 3,
    description: 'Main process pool'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(PoolService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get pools using companyId query', () => {
    service.getPools(3).subscribe((pools) => {
      expect(pools).toEqual([pool]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/pools` &&
      request.params.get('companyId') === '3'
    );
    expect(req.request.method).toBe('GET');
    req.flush([pool]);
  });

  it('should get a pool by id', () => {
    service.getPoolById(1).subscribe((result) => {
      expect(result).toEqual(pool);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pools/1`);
    expect(req.request.method).toBe('GET');
    req.flush(pool);
  });

  it('should create a pool', () => {
    const request: CreatePoolRequest = {
      name: 'Main Pool',
      companyId: 3,
      description: 'Main process pool'
    };

    service.createPool(request).subscribe((result) => {
      expect(result).toEqual(pool);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pools`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(pool);
  });

  it('should update a pool', () => {
    const request: UpdatePoolRequest = {
      name: 'Updated Pool'
    };
    const response: PoolResponse = { ...pool, ...request };

    service.updatePool(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pools/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a pool', () => {
    service.deletePool(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pools/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
