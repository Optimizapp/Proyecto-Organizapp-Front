import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiErrorResponse, FormErrorMap } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorService {
  private readonly fallbackMessage = 'Ocurrio un error inesperado. Intenta nuevamente.';

  getMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'No fue posible conectar con el servidor. Verifica la red o que el backend este activo.';
    }

    const apiError = this.normalizeError(error);

    if (apiError?.message) {
      return apiError.message;
    }

    if (error instanceof HttpErrorResponse) {
      return this.getMessageByStatus(error.status);
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return this.fallbackMessage;
  }

  getFieldErrors(error: unknown): FormErrorMap {
    return this.normalizeError(error)?.fields ?? {};
  }

  isApiError(error: unknown): error is ApiErrorResponse {
    if (!this.isRecord(error)) {
      return false;
    }

    return (
      typeof error['timestamp'] === 'string' &&
      typeof error['status'] === 'number' &&
      typeof error['error'] === 'string' &&
      typeof error['message'] === 'string' &&
      typeof error['path'] === 'string' &&
      (error['fields'] === undefined || this.isStringRecord(error['fields']))
    );
  }

  normalizeError(error: unknown): ApiErrorResponse | null {
    if (this.isApiError(error)) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      if (this.isApiError(error.error)) {
        return error.error;
      }

      return {
        timestamp: new Date().toISOString(),
        status: error.status,
        error: error.statusText || 'HTTP Error',
        message: this.getMessageByStatus(error.status),
        path: error.url ?? ''
      };
    }

    return null;
  }

  private getMessageByStatus(status: number): string {
    switch (status) {
      case 0:
        return 'No fue posible conectar con el servidor. Verifica la red o que el backend este activo.';
      case 400:
        return 'La solicitud contiene datos invalidos. Revisa la informacion e intenta nuevamente.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 409:
        return 'La solicitud genera un conflicto con el estado actual de los datos.';
      case 500:
        return 'El servidor no pudo procesar la solicitud. Intenta nuevamente mas tarde.';
      default:
        return this.fallbackMessage;
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isStringRecord(value: unknown): value is Record<string, string> {
    if (!this.isRecord(value)) {
      return false;
    }

    return Object.values(value).every((entry) => typeof entry === 'string');
  }
}
