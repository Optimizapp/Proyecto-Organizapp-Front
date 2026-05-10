import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Company,
  CompanyResponse,
  CreateCompanyRequest,
  RegisterCompanyRequest,
  RegisterCompanyResponse,
  UpdateCompanyRequest
} from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly apiUrl = `${environment.apiUrl}/companies`;
  private http = inject(HttpClient);

  getCompanies(): Observable<CompanyResponse[]> {
    return this.http.get<CompanyResponse[]>(this.apiUrl);
  }

  getCompanyById(id: number): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.apiUrl}/${id}`);
  }

  createCompany(request: CreateCompanyRequest): Observable<CompanyResponse> {
    return this.http.post<CompanyResponse>(this.apiUrl, request);
  }

  updateCompany(id: number, request: UpdateCompanyRequest): Observable<CompanyResponse> {
    return this.http.put<CompanyResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  registerCompany(request: RegisterCompanyRequest): Observable<RegisterCompanyResponse> {
    return this.http.post<RegisterCompanyResponse>(`${this.apiUrl}/register`, request);
  }

  getAll(): Observable<Company[]> {
    return this.getCompanies();
  }

  create(company: CreateCompanyRequest): Observable<Company> {
    return this.createCompany(company);
  }

  update(id: number, company: UpdateCompanyRequest): Observable<Company> {
    return this.updateCompany(id, company);
  }

  delete(id: number): Observable<void> {
    return this.deleteCompany(id);
  }
}
