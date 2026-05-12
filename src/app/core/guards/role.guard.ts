import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles: string[] = route.data?.['roles'] || [];
  const currentUserRole = authService.getUsersRole(); 
  if (authService.isAuthenticated() && currentUserRole !== null && expectedRoles.includes(currentUserRole)) {
    return true; // Tiene el rol adecuado
  }
  router.navigate(['/processes']);
  return false;
};