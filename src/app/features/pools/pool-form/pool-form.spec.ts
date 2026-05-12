import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CompanyResponse, PoolResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { PoolService } from '../../../services/pool.service';
import { PoolForm } from './pool-form';

describe('PoolForm', () => {
  let component: PoolForm;
  let fixture: ComponentFixture<PoolForm>;
  let router: Router;
  let companyServiceMock: {
    getCompanies: ReturnType<typeof vi.fn>;
  };
  let poolServiceMock: {
    getPoolById: ReturnType<typeof vi.fn>;
    createPool: ReturnType<typeof vi.fn>;
    updatePool: ReturnType<typeof vi.fn>;
  };

  const companies: CompanyResponse[] = [
    { id: 10, name: 'Acme', nit: '900', address: 'Main', phone: '555' }
  ];
  const pool: PoolResponse = {
    id: 30,
    name: 'Pool principal',
    companyId: 10,
    description: 'Base'
  };

  async function createComponent(id?: string): Promise<void> {
    companyServiceMock = {
      getCompanies: vi.fn(() => of(companies))
    };
    poolServiceMock = {
      getPoolById: vi.fn(() => of(pool)),
      createPool: vi.fn(() => of(pool)),
      updatePool: vi.fn(() => of(pool))
    };

    await TestBed.configureTestingModule({
      imports: [PoolForm],
      providers: [
        provideRouter([]),
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: PoolService, useValue: poolServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(id ? { id } : {})
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(PoolForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should load companies', async () => {
    await createComponent();

    expect(companyServiceMock.getCompanies).toHaveBeenCalled();
    expect(component.companies).toEqual(companies);
  });

  it('should not submit an invalid form', async () => {
    await createComponent();

    component.savePool();

    expect(component.poolForm.invalid).toBe(true);
    expect(poolServiceMock.createPool).not.toHaveBeenCalled();
  });

  it('should create a pool with companyId', async () => {
    await createComponent();

    component.poolForm.setValue({
      name: 'Pool principal',
      companyId: 10,
      description: 'Base'
    });
    component.savePool();

    expect(poolServiceMock.createPool).toHaveBeenCalledWith({
      name: 'Pool principal',
      companyId: 10,
      description: 'Base'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/pools']);
  });

  it('should update a pool in edit mode', async () => {
    await createComponent('30');

    expect(poolServiceMock.getPoolById).toHaveBeenCalledWith(30);
    component.poolForm.patchValue({ name: 'Pool actualizado' });
    component.savePool();

    expect(poolServiceMock.updatePool).toHaveBeenCalledWith(30, {
      name: 'Pool actualizado',
      companyId: 10,
      description: 'Base'
    });
  });

  it('should handle backend errors', async () => {
    await createComponent();
    poolServiceMock.createPool.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 400 })));
    component.poolForm.setValue({
      name: 'Pool principal',
      companyId: 10,
      description: ''
    });

    component.savePool();

    expect(component.error).toBeTruthy();
  });
});
