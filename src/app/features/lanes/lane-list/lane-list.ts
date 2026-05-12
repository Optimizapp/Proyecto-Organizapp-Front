import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

const STUB_STYLES = `
  .stub-page { padding: 2rem 2.25rem; }
  .stub-header {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 2rem; flex-wrap: wrap;
  }
  .stub-icon {
    width: 54px; height: 54px; border-radius: var(--radius-md);
    background: var(--accent-light); color: var(--accent);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .stub-title { font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem; }
  .stub-subtitle { font-size: 0.875rem; color: var(--text-secondary); }
  .stub-action { margin-left: auto; }
  .stub-coming-soon {
    background: var(--bg-card); border: 1px dashed var(--border);
    border-radius: var(--radius-lg); padding: 3.5rem 2rem;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 0.75rem;
  }
  .coming-icon { color: var(--text-muted); margin-bottom: 0.5rem; }
  .stub-coming-soon h3 { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
  .stub-coming-soon p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }
  .coming-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; }
  .chip {
    background: var(--accent-light); color: var(--accent);
    padding: 0.3rem 0.85rem; border-radius: 99px;
    font-size: 0.78rem; font-weight: 600;
  }
  @media (max-width: 640px) { .stub-page { padding: 1.25rem 1rem; } }
`;

@Component({
  selector: 'app-lane-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="stub-page">
      <div class="stub-header">
        <div class="stub-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </div>
        <div>
          <h2 class="stub-title">Lanes</h2>
          <p class="stub-subtitle">Carriles de participación dentro de los pools BPMN</p>
        </div>
        <button class="btn btn-primary stub-action" disabled>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo lane
        </button>
      </div>

      <div class="stub-coming-soon">
        <div class="coming-icon">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </div>
        <h3>Módulo en desarrollo</h3>
        <p>La gestión de lanes estará disponible próximamente.<br>Los lanes definen quién realiza cada actividad dentro de un pool.</p>
        <div class="coming-chips">
          <span class="chip">Lanes por pool</span>
          <span class="chip">Asignación de responsables</span>
          <span class="chip">Diagramas BPMN</span>
        </div>
      </div>
    </div>
  `,
  styles: [STUB_STYLES]
})
export class LaneList {}
