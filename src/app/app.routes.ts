import { Routes } from '@angular/router';
import { CompanyList } from './features/companies/company-list/company-list';
import { LaneList } from './features/lanes/lane-list/lane-list';
import { PoolList } from './features/pools/pool-list/pool-list';
import { ProcessList } from './features/processes/process-list/process-list';
import { ProcessDetail } from './features/processes/process-detail/process-detail';
import { ProcessForm } from './features/processes/process-form/process-form';
import { RoleList } from './features/roles/role-list/role-list';
import { UserList } from './features/users/user-list/user-list';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'processes', pathMatch: 'full' },
  { path: 'companies', component: CompanyList },
  { path: 'users', component: UserList },
  { path: 'roles', component: RoleList },
  { path: 'pools', component: PoolList },
  { path: 'lanes', component: LaneList },
  { path: 'processes', component: ProcessList },
  { path: 'processes/new', component: ProcessForm },
  { path: 'processes/:id/edit', component: ProcessForm },
  { path: 'processes/:id', component: ProcessDetail },
  {   
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent) 
  }  
];
