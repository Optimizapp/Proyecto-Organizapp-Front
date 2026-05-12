import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common'; // Fundamental para SSR
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); // Inyectamos el ID de la plataforma

  // Inicializamos en null de forma segura
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    // Solo accedemos al almacenamiento si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.tokenSubject.next(savedToken);
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Protección de plataforma para persistencia
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    // El valor del Subject es nuestra fuente de verdad reactiva
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUsersRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role || null;
    }
    return null;
  }
}
