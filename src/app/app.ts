import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudianteService } from './services/estudiantes';
import { Estudiante } from './models/estudiantes.models';
import { Header } from './components/layout/header/header';
import { Sidebar } from './components/layout/sidebar/sidebar';
import { Footer } from './components/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Header, Sidebar, Footer], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  estudiantes: Estudiante[] = [];

  constructor(private estudiantesService: EstudianteService) {}

  ngOnInit(): void {
    this.listarEstudiantes();
  }

  listarEstudiantes(): void {
    this.estudiantesService.listarEstudiantePrueba().subscribe(data => {
    this.estudiantes = data;
    });
  }
}