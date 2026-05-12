import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { UserResponse } from '../../../core/models';
import { ApiErrorService } from '../../../core/services/api-error.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="feature-page">
      <div class="page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Usuarios reales asociados a empresas y roles.</p>
        </div>
        <a routerLink="/users/new" class="primary-action">Nuevo usuario</a>
      </div>

      <div *ngIf="isLoading" class="state-message">Cargando usuarios...</div>
      <div *ngIf="error" class="state-message error">{{ error }}</div>

      <div *ngIf="!isLoading && !error && users.length === 0" class="state-message">
        No hay usuarios registrados.
      </div>

      <div *ngIf="!isLoading && !error && users.length > 0" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Empresa</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.companyId }}</td>
              <td>{{ user.roleId }}</td>
              <td>{{ user.active ? 'Activo' : 'Inactivo' }}</td>
              <td>
                <a [routerLink]="['/users', user.id, 'edit']" class="text-action">Editar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }

      .primary-action,
      .text-action {
        color: var(--accent-color);
        font-weight: 600;
        text-decoration: none;
      }

      .primary-action {
        border: 1px solid var(--accent-color);
        border-radius: var(--radius-sm);
        padding: 0.7rem 1rem;
        white-space: nowrap;
      }

      .state-message {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 1rem;
        color: var(--text-secondary);
      }

      .error {
        color: #b42318;
        border-color: #fda29b;
        background: #fff1f0;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 0.85rem;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
      }
    `
  ]
})
export class UserList implements OnInit {
  users: UserResponse[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private apiErrorService: ApiErrorService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    this.userService
      .getUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error: unknown) => {
          this.users = [];
          this.error = this.apiErrorService.getMessage(error);
        }
      });
  }
}
