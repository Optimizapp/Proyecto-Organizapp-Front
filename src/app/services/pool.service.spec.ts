import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { PoolService } from './pool.service';

describe('PoolService', () => {
  let service: PoolService;
  let httpMock: HttpTestingController;

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
      expect(pools).toEqual([]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/pools` &&
      request.params.get('companyId') === '3'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
