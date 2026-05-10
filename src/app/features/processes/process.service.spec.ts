import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CreateProcessRequest, ProcessResponse, UpdateProcessRequest } from '../../core/models';
import { ProcessService } from './process.service';

describe('ProcessService', () => {
  let service: ProcessService;
  let httpMock: HttpTestingController;

  const process: ProcessResponse = {
    id: 1,
    name: 'Onboarding',
    description: 'Employee onboarding',
    category: 'HR',
    status: 'DRAFT',
    companyId: 2,
    userId: 3,
    mainPoolId: 4
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProcessService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get processes without filters', () => {
    service.getProcesses().subscribe((processes) => {
      expect(processes).toEqual([process]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/processes`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys()).toEqual([]);
    req.flush([process]);
  });

  it('should get processes using companyId and status query params', () => {
    service.getProcesses(2, 'ACTIVE').subscribe((processes) => {
      expect(processes).toEqual([{ ...process, status: 'ACTIVE' }]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/processes` &&
      request.params.get('companyId') === '2' &&
      request.params.get('status') === 'ACTIVE'
    );
    expect(req.request.method).toBe('GET');
    req.flush([{ ...process, status: 'ACTIVE' }]);
  });

  it('should get a process by id', () => {
    service.getProcessById(1).subscribe((result) => {
      expect(result).toEqual(process);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/processes/1`);
    expect(req.request.method).toBe('GET');
    req.flush(process);
  });

  it('should create a process', () => {
    const request: CreateProcessRequest = {
      name: 'Onboarding',
      description: 'Employee onboarding',
      category: 'HR',
      status: 'DRAFT',
      companyId: 2,
      userId: 3,
      mainPoolId: 4
    };

    service.createProcess(request).subscribe((result) => {
      expect(result).toEqual(process);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/processes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(process);
  });

  it('should update a process', () => {
    const request: UpdateProcessRequest = {
      name: 'Onboarding v2',
      status: 'ACTIVE'
    };
    const response: ProcessResponse = { ...process, ...request };

    service.updateProcess(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/processes/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a process', () => {
    service.deleteProcess(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/processes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
