import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProcessDetail } from './process-detail';
import { ProcessService } from '../process.service';

describe('ProcessDetail', () => {
  let component: ProcessDetail;
  let fixture: ComponentFixture<ProcessDetail>;
  const processServiceMock = {
    getProcessById: () =>
      of({
        id: 1,
        name: 'Proceso base',
        status: 'DRAFT',
        companyId: 1,
        userId: 1
      })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessDetail],
      providers: [
        provideRouter([]),
        { provide: ProcessService, useValue: processServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the selected process from the route id', () => {
    expect(component.process?.id).toBe(1);
    expect(component.error).toBeNull();
  });
});
