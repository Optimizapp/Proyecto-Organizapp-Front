import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CompanyResponse, PoolResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { PoolService } from '../../../services/pool.service';
import { PoolList } from './pool-list';

describe('PoolList', () => {
  let component: PoolList;
  let fixture: ComponentFixture<PoolList>;
  let companyServiceMock: {
    getCompanies: ReturnType<typeof vi.fn>;
  };
  let poolServiceMock: {
    getPools: ReturnType<typeof vi.fn>;
  };

  const companies: CompanyResponse[] = [
    { id: 10, name: 'Acme', nit: '900', address: 'Main', phone: '555' }
  ];
  const pools: PoolResponse[] = [
    { id: 30, name: 'Pool principal', companyId: 10, description: 'Base' }
  ];

  async function createComponent(): Promise<void> {
    companyServiceMock = {
      getCompanies: vi.fn(() => of(companies))
    };
    poolServiceMock = {
      getPools: vi.fn(() => of(pools))
    };

    await TestBed.configureTestingModule({
      imports: [PoolList],
      providers: [
        provideRouter([]),
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: PoolService, useValue: poolServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoolList);
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

  it('should load pools by company', async () => {
    await createComponent();

    component.filterForm.patchValue({ companyId: 10 });
    component.onCompanyChange();

    expect(poolServiceMock.getPools).toHaveBeenCalledWith(10);
    expect(component.pools).toEqual(pools);
  });

  it('should show an empty state', async () => {
    await createComponent();
    poolServiceMock.getPools.mockReturnValue(of([]));

    component.filterForm.patchValue({ companyId: 10 });
    component.onCompanyChange();
    fixture.detectChanges();

    expect(component.pools).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No hay pools registrados');
  });

  it('should handle backend errors', async () => {
    await createComponent();
    poolServiceMock.getPools.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.filterForm.patchValue({ companyId: 10 });
    component.onCompanyChange();

    expect(component.error).toBeTruthy();
    expect(component.pools).toEqual([]);
  });
});
