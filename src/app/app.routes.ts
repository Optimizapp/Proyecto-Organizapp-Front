import { Routes } from '@angular/router';
import { ProcessList } from './features/processes/process-list/process-list';
import { ProcessDetail } from './features/processes/process-detail/process-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'processes', pathMatch: 'full' },
  { path: 'processes', component: ProcessList },
  { path: 'processes/:id', component: ProcessDetail }
];