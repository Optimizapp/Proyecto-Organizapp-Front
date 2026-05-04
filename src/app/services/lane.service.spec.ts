import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { CreateLaneRequest, LaneResponse, UpdateLaneRequest } from '../core/models';
import { LaneService } from './lane.service';

describe('LaneService', () => {
  let service: LaneService;
  let httpMock: HttpTestingController;

  const lane: LaneResponse = {
    id: 1,
    name: 'Operations',
    poolId: 5,
    description: 'Operations lane'
  };

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
      expect(lanes).toEqual([lane]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/lanes` &&
      request.params.get('poolId') === '5'
    );
    expect(req.request.method).toBe('GET');
    req.flush([lane]);
  });

  it('should get a lane by id', () => {
    service.getLaneById(1).subscribe((result) => {
      expect(result).toEqual(lane);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/lanes/1`);
    expect(req.request.method).toBe('GET');
    req.flush(lane);
  });

  it('should create a lane', () => {
    const request: CreateLaneRequest = {
      name: 'Operations',
      poolId: 5,
      description: 'Operations lane'
    };

    service.createLane(request).subscribe((result) => {
      expect(result).toEqual(lane);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/lanes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(lane);
  });

  it('should update a lane', () => {
    const request: UpdateLaneRequest = {
      name: 'Operations Updated'
    };
    const response: LaneResponse = { ...lane, ...request };

    service.updateLane(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/lanes/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a lane', () => {
    service.deleteLane(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/lanes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
