import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiErrorResponse } from '../models';
import { ApiErrorService } from './api-error.service';

describe('ApiErrorService', () => {
  let service: ApiErrorService;

  const apiError: ApiErrorResponse = {
    timestamp: '2026-05-03T00:00:00Z',
    status: 400,
    error: 'Bad Request',
    message: 'Datos invalidos',
    path: '/api/users',
    fields: {
      email: 'El correo ya existe'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorService);
  });

  it('should extract message from ApiErrorResponse inside HttpErrorResponse', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      url: '/api/users',
      error: apiError
    });

    expect(service.getMessage(error)).toBe('Datos invalidos');
  });

  it('should extract field errors from ApiErrorResponse', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      url: '/api/users',
      error: apiError
    });

    expect(service.getFieldErrors(error)).toEqual({
      email: 'El correo ya existe'
    });
  });

  it('should handle status 0 as a connection error', () => {
    const error = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      url: '/api/processes'
    });

    expect(service.getMessage(error)).toContain('No fue posible conectar');
  });

  it('should handle unknown errors with a generic message', () => {
    expect(service.getMessage({ unexpected: true })).toBe('Ocurrio un error inesperado. Intenta nuevamente.');
  });

  it('should detect a valid ApiErrorResponse', () => {
    expect(service.isApiError(apiError)).toBe(true);
  });

  it('should normalize HttpErrorResponse into ApiErrorResponse', () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: '/api/processes/999'
    });

    expect(service.normalizeError(error)).toEqual(
      expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'El recurso solicitado no fue encontrado.',
        path: '/api/processes/999'
      })
    );
  });

  it('should handle 400 errors without response body or fields', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      url: '/api/users'
    });

    expect(service.getMessage(error)).toBe('La solicitud contiene datos invalidos. Revisa la informacion e intenta nuevamente.');
    expect(service.getFieldErrors(error)).toEqual({});
  });

  it('should handle 409 conflict errors', () => {
    const error = new HttpErrorResponse({
      status: 409,
      statusText: 'Conflict',
      url: '/api/roles'
    });

    expect(service.getMessage(error)).toBe('La solicitud genera un conflicto con el estado actual de los datos.');
  });

  it('should handle 500 internal server errors', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      url: '/api/processes'
    });

    expect(service.getMessage(error)).toBe('El servidor no pudo procesar la solicitud. Intenta nuevamente mas tarde.');
  });
});
