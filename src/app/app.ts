import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  EstudianteService } from './services/estudiantes';
import { Estudiante } from './models/estudiantes.models';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], 
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