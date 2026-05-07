import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ProcessService } from '../process.service';

@Component({
  selector: 'app-process-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './process-form.html',
  styleUrl: './process-form.css'
})
export class ProcessForm implements OnInit {
  processId?: number;
  isEditMode = false;
  loading = false;
  errorMessage = '';

  processForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private processService: ProcessService
  ) {}

  ngOnInit(): void {
    this.processForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      status: ['Borrador', [Validators.required]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.processId = Number(idParam);
      this.isEditMode = true;
      this.loadProcess(this.processId);
    }
  }

  loadProcess(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.processService.getProcessById(id).subscribe({
      next: (process) => {
        if (!process) {
          this.errorMessage = 'No se encontró el proceso solicitado.';
          this.loading = false;
          return;
        }

        this.processForm.patchValue({
          name: process.name,
          description: process.description || '',
          status: process.status || 'Borrador'
        });

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el proceso.';
        this.loading = false;
      }
    });
  }

  saveProcess(): void {
    this.errorMessage = '';

    if (this.processForm.invalid) {
      this.processForm.markAllAsTouched();
      return;
    }

    const formValue = this.processForm.getRawValue();

    const processData = {
      name: formValue.name || '',
      description: formValue.description || '',
      status: formValue.status || 'Borrador'
    };

    if (this.isEditMode && this.processId) {
      this.processService.updateProcess(this.processId, processData).subscribe({
        next: (process) => {
          if (!process) {
            this.errorMessage = 'No se pudo actualizar el proceso.';
            return;
          }

          this.router.navigate(['/processes', this.processId]);
        },
        error: () => {
          this.errorMessage = 'Ocurrió un error al actualizar el proceso.';
        }
      });

      return;
    }

    this.processService.createProcess(processData).subscribe({
      next: (process) => {
        this.router.navigate(['/processes', process.id]);
      },
      error: () => {
        this.errorMessage = 'Ocurrió un error al crear el proceso.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/processes']);
  }

  isInvalid(fieldName: 'name' | 'description' | 'status'): boolean {
    const field = this.processForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}