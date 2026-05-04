import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { NodeRequest, NodeResponse } from '../core/models';
import { NodeService } from './node.service';

describe('NodeService', () => {
  let service: NodeService;
  let httpMock: HttpTestingController;

  const node: NodeResponse = {
    id: 1,
    versionId: 11,
    laneId: 5,
    type: 'TASK',
    name: 'Review request',
    description: 'Review the submitted request',
    x: 120,
    y: 240
  };

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
      expect(nodes).toEqual([node]);
    });

    const req = httpMock.expectOne((request) =>
      request.url === `${environment.apiUrl}/nodes` &&
      request.params.get('versionId') === '11'
    );
    expect(req.request.method).toBe('GET');
    req.flush([node]);
  });

  it('should get a node by id', () => {
    service.getNodeById(1).subscribe((result) => {
      expect(result).toEqual(node);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/nodes/1`);
    expect(req.request.method).toBe('GET');
    req.flush(node);
  });

  it('should create a node', () => {
    const request: NodeRequest = {
      versionId: 11,
      laneId: 5,
      type: 'TASK',
      name: 'Review request',
      description: 'Review the submitted request',
      x: 120,
      y: 240
    };

    service.createNode(request).subscribe((result) => {
      expect(result).toEqual(node);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/nodes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(node);
  });

  it('should update a node', () => {
    const request: NodeRequest = {
      versionId: 11,
      laneId: 5,
      type: 'TASK',
      name: 'Approve request',
      x: 160,
      y: 260
    };
    const response: NodeResponse = { ...node, ...request };

    service.updateNode(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/nodes/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a node', () => {
    service.deleteNode(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/nodes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
