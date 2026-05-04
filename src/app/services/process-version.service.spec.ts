import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ProcessVersionRequest, ProcessVersionResponse } from '../core/models';
import { ProcessVersionService } from './process-version.service';

describe('ProcessVersionService', () => {
  let service: ProcessVersionService;
  let httpMock: HttpTestingController;

  const version: ProcessVersionResponse = {
    id: 9,
    processId: 2,
    versionNumber: 1,
    status: 'DRAFT',
    notes: 'Initial version'
  };

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

  it('should get versions using processId query', () => {
    service.getVersions(2).subscribe((versions) => {
      expect(versions).toEqual([version]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/process-versions` &&
      request.params.get('processId') === '2'
    );
    expect(req.request.method).toBe('GET');
    req.flush([version]);
  });

  it('should get a version by id', () => {
    service.getVersionById(9).subscribe((result) => {
      expect(result).toEqual(version);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/process-versions/9`);
    expect(req.request.method).toBe('GET');
    req.flush(version);
  });

  it('should create a version', () => {
    const request: ProcessVersionRequest = {
      processId: 2,
      versionNumber: 1,
      status: 'DRAFT',
      notes: 'Initial version'
    };

    service.createVersion(request).subscribe((result) => {
      expect(result).toEqual(version);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/process-versions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(version);
  });

  it('should update a version', () => {
    const request: ProcessVersionRequest = {
      processId: 2,
      status: 'ARCHIVED',
      notes: 'Archived version'
    };
    const response: ProcessVersionResponse = { ...version, status: 'ARCHIVED', notes: 'Archived version' };

    service.updateVersion(9, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/process-versions/9`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should publish a version using POST /process-versions/{id}/publish', () => {
    const response: ProcessVersionResponse = { ...version, status: 'PUBLISHED' };

    service.publishVersion(9).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/process-versions/9/publish`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(response);
  });
});
