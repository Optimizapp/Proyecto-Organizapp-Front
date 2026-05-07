import { Routes } from '@angular/router';
import { ProcessList } from './features/processes/process-list/process-list';
import { ProcessDetail } from './features/processes/process-detail/process-detail';
import { ProcessForm } from './features/processes/process-form/process-form';

export const routes: Routes = [
  { path: '', redirectTo: 'processes', pathMatch: 'full' },
  { path: 'processes', component: ProcessList },
  { path: 'processes/new', component: ProcessForm },
  { path: 'processes/:id/edit', component: ProcessForm },
  { path: 'processes/:id', component: ProcessDetail }
];