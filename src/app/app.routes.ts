import { Routes } from '@angular/router';
import { ProcessList } from './features/processes/process-list/process-list';
import { ProcessDetail } from './features/processes/process-detail/process-detail';
import { CompanyListComponent } from './features/companies/company-list/company-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'processes', pathMatch: 'full' },
  { path: 'processes', component: ProcessList },
  { path: 'processes/:id', component: ProcessDetail },
  { path: 'companies', component: CompanyListComponent },
  { path: '', redirectTo: 'companies', pathMatch: 'full' }
];