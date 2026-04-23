import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Estudiante } from '../models/estudiantes.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstudianteService {

 listarEstudiantePrueba(): Observable<Estudiante[]> {
  const Estudiante: Estudiante[] = [
    { id: 1, nombre: 'Juan Pérez', carrera: 'Ingeniería de Sistemas', promedio: 3.5 },
    { id: 2, nombre: 'María Gómez', carrera: 'Administración de Empresas', promedio: 3.8 },
    { id: 3, nombre: 'Carlos Rodríguez', carrera: 'Derecho', promedio: 3.2 },
  ];

  return of(Estudiante);
  }
  

  private readonly apiUrl = `${environment.apiUrl}/Estudiante`;

  constructor(private http: HttpClient) {}

  listarEstudiante(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  obtenerEstudiantePorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  crearEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  actualizarEstudiante(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  eliminarEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
