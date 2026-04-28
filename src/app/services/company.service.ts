import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../features/companies/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // Ajusta esta URL si tu backend corre en otro puerto, pero generalmente es localhost:8080
  private apiUrl = 'http://localhost:8080/api/companies';
  private http = inject(HttpClient);

  // Obtener todas las empresas
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  // Crear una nueva empresa
  create(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  // Actualizar una empresa
  update(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }

  // Eliminar una empresa
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}