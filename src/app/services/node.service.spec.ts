import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { NodeService } from './node.service';

describe('NodeService', () => {
  let service: NodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(NodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get nodes using versionId query', () => {
    service.getNodes(11).subscribe((nodes) => {
      expect(nodes).toEqual([]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/nodes` &&
      request.params.get('versionId') === '11'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
