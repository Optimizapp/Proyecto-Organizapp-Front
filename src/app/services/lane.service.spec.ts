import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { LaneService } from './lane.service';

describe('LaneService', () => {
  let service: LaneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(LaneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get lanes using poolId query', () => {
    service.getLanes(5).subscribe((lanes) => {
      expect(lanes).toEqual([]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/lanes` &&
      request.params.get('poolId') === '5'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
