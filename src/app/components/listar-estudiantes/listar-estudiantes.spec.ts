import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEstudiantes } from './listar-estudiantes';

describe('ListarEstudiantes', () => {
  let component: ListarEstudiantes;
  let fixture: ComponentFixture<ListarEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEstudiantes],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarEstudiantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
