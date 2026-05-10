import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section class="feature-page">
      <h2>Empresas</h2>
      <p>Modulo base para registrar y consultar empresas desde el backend.</p>
    </section>
  `
})
export class CompanyList {}
