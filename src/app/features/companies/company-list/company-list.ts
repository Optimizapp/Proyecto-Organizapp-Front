import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="feature-page">
      <div class="page-header">
        <div>
          <h2>Empresas</h2>
          <p>Gestiona y consulta el directorio de empresas registradas.</p>
        </div>
        <button class="btn-primary">
          <span class="plus-icon">+</span> Nueva Empresa
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Sector</th>
              <th>Estado</th>
              <th>Última Actividad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let company of companies">
              <td>
                <div class="company-info">
                  <div class="company-avatar">{{ company.name.charAt(0) }}</div>
                  <div class="company-details">
                    <span class="company-name">{{ company.name }}</span>
                    <span class="company-id">ID: {{ company.id }}</span>
                  </div>
                </div>
              </td>
              <td>{{ company.sector }}</td>
              <td>
                <span class="status-badge" [class.active]="company.status === 'Activo'" [class.inactive]="company.status === 'Inactivo'">
                  {{ company.status }}
                </span>
              </td>
              <td>{{ company.lastActivity }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon" title="Editar">✏️</button>
                  <button class="btn-icon delete" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(67, 24, 255, 0.3);
    }
    
    .table-container {
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      border: 1px solid rgba(0,0,0,0.05);
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    
    .data-table th {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .data-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      vertical-align: middle;
      color: var(--text-primary);
    }
    
    .data-table tbody tr {
      transition: background 0.2s;
    }
    
    .data-table tbody tr:hover {
      background: rgba(67, 24, 255, 0.02);
    }
    
    .company-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .company-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(67, 24, 255, 0.1);
      color: var(--accent-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }
    
    .company-details {
      display: flex;
      flex-direction: column;
    }
    
    .company-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .company-id {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    
    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .status-badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    
    .status-badge.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      opacity: 0.6;
      transition: opacity 0.2s, transform 0.2s;
    }
    
    .btn-icon:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  `]
})
export class CompanyList {
  companies = [
    { id: 'EMP-001', name: 'TechSolutions Corp', sector: 'Tecnología', status: 'Activo', lastActivity: 'Hoy, 10:30 AM' },
    { id: 'EMP-002', name: 'Global Logistics', sector: 'Transporte', status: 'Activo', lastActivity: 'Ayer, 16:45 PM' },
    { id: 'EMP-003', name: 'Natura Foods', sector: 'Alimentación', status: 'Inactivo', lastActivity: 'Hace 3 días' },
    { id: 'EMP-004', name: 'Finanzas Plus', sector: 'Finanzas', status: 'Activo', lastActivity: 'Hoy, 09:15 AM' }
  ];
}
