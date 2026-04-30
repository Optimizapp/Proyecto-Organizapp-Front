import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. RUTA PÚBLICA: El punto de entrada
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },

  // 2. RUTAS PROTEGIDAS: Agrupadas bajo el mismo Guard para mayor mantenibilidad
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // Redirección inicial tras el login exitoso
      { path: '', redirectTo: 'companies', pathMatch: 'full' },

      // Módulo de Empresas (Persona 2)
      {
        path: 'companies',
        children: [
          { 
            path: '', 
            loadComponent: () => import('./features/companies/company-list/company-list.component').then(m => m.CompanyListComponent) 
          },
          { 
          path: 'new', 
          loadComponent: () => import('./features/companies/form/company-form.component').then(m => m.CompanyFormComponent) 
          },
          { 
          path: 'edit/:id', 
          loadComponent: () => import('./features/companies/form/company-form.component').then(m => m.CompanyFormComponent) 
          }
        ]
      },

      // Módulo de Procesos
      {
        path: 'processes',
        children: [
          { 
            path: '', 
            loadComponent: () => import('./features/processes/process-list/process-list').then(m => m.ProcessList) 
          },
          { 
            path: ':id', 
            loadComponent: () => import('./features/processes/process-detail/process-detail').then(m => m.ProcessDetail) 
          }
        ]
      }
    ]
  },

  // 3. GESTIÓN DE ERRORES: Ruta comodín para URLs inexistentes
  { path: '**', redirectTo: 'login' }
];