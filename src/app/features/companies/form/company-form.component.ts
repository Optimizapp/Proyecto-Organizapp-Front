import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  companyForm: FormGroup;
  isEditMode = false;
  companyId?: number;

  constructor() {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nit: ['', [Validators.required, Validators.pattern('^[0-9.-]+$')]],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Verificamos si hay un ID en la URL para saber si es "Editar"
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.companyId) {
      this.isEditMode = true;
      // Aquí cargar los datos de la empresa para editarlos
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const companyData = this.companyForm.value;
      
      if (this.isEditMode && this.companyId) {
        this.companyService.update(this.companyId, companyData).subscribe(() => {
          this.router.navigate(['/companies']);
        });
      } else {
        this.companyService.create(companyData).subscribe(() => {
          this.router.navigate(['/companies']);
        });
      }
    }
  }
}