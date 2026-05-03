import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ProcessVersionService } from './process-version.service';

describe('ProcessVersionService', () => {
  let service: ProcessVersionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProcessVersionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should publish a version using POST /process-versions/{id}/publish', () => {
    service.publishVersion(9).subscribe((version) => {
      expect(version.id).toBe(9);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/process-versions/9/publish`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 9, processId: 2, versionNumber: 1, status: 'PUBLISHED' });
  });
});
