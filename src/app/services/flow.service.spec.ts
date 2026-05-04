import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { FlowRequest, FlowResponse } from '../core/models';
import { FlowService } from './flow.service';

describe('FlowService', () => {
  let service: FlowService;
  let httpMock: HttpTestingController;

  const flow: FlowResponse = {
    id: 1,
    versionId: 13,
    sourceNodeId: 4,
    targetNodeId: 5,
    type: 'SEQUENCE',
    name: 'Continue'
  };

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
      expect(flows).toEqual([flow]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/flows` &&
      request.params.get('versionId') === '13'
    );
    expect(req.request.method).toBe('GET');
    req.flush([flow]);
  });

  it('should get a flow by id', () => {
    service.getFlowById(1).subscribe((result) => {
      expect(result).toEqual(flow);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flows/1`);
    expect(req.request.method).toBe('GET');
    req.flush(flow);
  });

  it('should create a flow', () => {
    const request: FlowRequest = {
      versionId: 13,
      sourceNodeId: 4,
      targetNodeId: 5,
      type: 'SEQUENCE',
      name: 'Continue'
    };

    service.createFlow(request).subscribe((result) => {
      expect(result).toEqual(flow);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flows`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(flow);
  });

  it('should update a flow', () => {
    const request: FlowRequest = {
      versionId: 13,
      sourceNodeId: 4,
      targetNodeId: 5,
      type: 'SEQUENCE',
      name: 'Approved path',
      conditionExpression: 'approved == true'
    };
    const response: FlowResponse = { ...flow, ...request };

    service.updateFlow(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flows/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a flow', () => {
    service.deleteFlow(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/flows/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
