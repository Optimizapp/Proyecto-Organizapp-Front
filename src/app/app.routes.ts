import { Routes } from '@angular/router';
import { CompanyList } from './features/companies/company-list/company-list';
import { CompanyFormComponent } from './features/companies/form/company-form.component';
import { LaneList } from './features/lanes/lane-list/lane-list';
import { PoolForm } from './features/pools/pool-form/pool-form';
import { PoolList } from './features/pools/pool-list/pool-list';
import { ProcessList } from './features/processes/process-list/process-list';
import { ProcessDetail } from './features/processes/process-detail/process-detail';
import { ProcessForm } from './features/processes/process-form/process-form';
import { RoleList } from './features/roles/role-list/role-list';
import { UserForm } from './features/users/user-form/user-form';
import { UserList } from './features/users/user-list/user-list';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'processes', pathMatch: 'full' },
  { path: 'companies', component: CompanyList },
  { path: 'companies/new', component: CompanyFormComponent },
  { path: 'companies/:id/edit', component: CompanyFormComponent },
  { path: 'users', component: UserList },
  { path: 'users/new', component: UserForm },
  { path: 'users/:id/edit', component: UserForm },
  { path: 'roles', component: RoleList },
  { path: 'pools', component: PoolList },
  { path: 'pools/new', component: PoolForm },
  { path: 'pools/:id/edit', component: PoolForm },
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
