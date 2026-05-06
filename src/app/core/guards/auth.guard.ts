import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guardián de ruta para proteger el acceso a módulos privados.
 * Justificación: Centraliza la lógica de acceso basándose en la existencia del JWT.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si existe un token activo a través del servicio
  if (authService.isAuthenticated()) {
    return true; // Acceso permitido
  }

  // Si no está autenticado, redirigimos al login y bloqueamos la navegación
  router.navigate(['/login']);
  return false;
};