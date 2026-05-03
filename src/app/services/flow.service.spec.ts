import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { FlowService } from './flow.service';

describe('FlowService', () => {
  let service: FlowService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(FlowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get flows using versionId query', () => {
    service.getFlows(13).subscribe((flows) => {
      expect(flows).toEqual([]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/flows` &&
      request.params.get('versionId') === '13'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
