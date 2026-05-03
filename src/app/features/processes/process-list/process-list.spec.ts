import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProcessList } from './process-list';
import { ProcessService } from '../process.service';

describe('ProcessList', () => {
  let component: ProcessList;
  let fixture: ComponentFixture<ProcessList>;
  const processServiceMock = {
    getProcesses: () => of([])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessList],
      providers: [
        provideRouter([]),
        { provide: ProcessService, useValue: processServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request the process list on init', () => {
    expect(component.processes).toEqual([]);
    expect(component.error).toBeNull();
  });
});
