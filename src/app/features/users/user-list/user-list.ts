import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <section class="feature-page">
      <h2>Usuarios</h2>
      <p>Modulo base para crear y consultar usuarios por empresa y rol.</p>
    </section>
  `
})
export class UserList {}
