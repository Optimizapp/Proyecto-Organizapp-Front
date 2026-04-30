import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      // Usamos validadores síncronos para mejorar la UX
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Al ser exitoso, el AuthService ya guardó el token vía el operador 'tap'
        this.router.navigate(['/companies']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        // Manejo de errores profesional: No mostramos el error crudo del servidor
        this.errorMessage = err.status === 401 
          ? 'Credenciales incorrectas. Intenta de nuevo.' 
          : 'Ocurrió un error en el servidor. Contacta al administrador.';
      }
    });
  }
}