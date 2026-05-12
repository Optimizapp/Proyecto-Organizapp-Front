import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CompanyResponse, LaneResponse, PoolResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { LaneService } from '../../../services/lane.service';
import { PoolService } from '../../../services/pool.service';
import { LaneList } from './lane-list';

describe('LaneList', () => {
  let component: LaneList;
  let fixture: ComponentFixture<LaneList>;
  let companyServiceMock: {
    getCompanies: ReturnType<typeof vi.fn>;
  };
  let poolServiceMock: {
    getPools: ReturnType<typeof vi.fn>;
  };
  let laneServiceMock: {
    getLanes: ReturnType<typeof vi.fn>;
    createLane: ReturnType<typeof vi.fn>;
  };

  const companies: CompanyResponse[] = [
    { id: 10, name: 'Acme', nit: '900', address: 'Main', phone: '555' }
  ];
  const pools: PoolResponse[] = [
    { id: 30, name: 'Pool principal', companyId: 10 }
  ];
  const lanes: LaneResponse[] = [
    { id: 40, name: 'Lane inicial', poolId: 30, description: 'Base' }
  ];

  async function createComponent(): Promise<void> {
    companyServiceMock = {
      getCompanies: vi.fn(() => of(companies))
    };
    poolServiceMock = {
      getPools: vi.fn(() => of(pools))
    };
    laneServiceMock = {
      getLanes: vi.fn(() => of(lanes)),
      createLane: vi.fn(() => of(lanes[0]))
    };

    await TestBed.configureTestingModule({
      imports: [LaneList],
      providers: [
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: PoolService, useValue: poolServiceMock },
        { provide: LaneService, useValue: laneServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LaneList);
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

  it('should load pools when selecting a company', async () => {
    await createComponent();

    component.filterForm.patchValue({ companyId: 10, poolId: 30 });
    component.onCompanyChange();

    expect(component.filterForm.value.poolId).toBeNull();
    expect(poolServiceMock.getPools).toHaveBeenCalledWith(10);
    expect(component.pools).toEqual(pools);
  });

  it('should load lanes when selecting a pool', async () => {
    await createComponent();

    component.filterForm.patchValue({ poolId: 30 });
    component.onPoolChange();

    expect(laneServiceMock.getLanes).toHaveBeenCalledWith(30);
    expect(component.lanes).toEqual(lanes);
  });

  it('should create a lane', async () => {
    await createComponent();

    component.filterForm.patchValue({ companyId: 10, poolId: 30 });
    component.laneForm.patchValue({ name: 'Lane nueva', description: 'Trabajo' });
    component.createLane();

    expect(laneServiceMock.createLane).toHaveBeenCalledWith({
      name: 'Lane nueva',
      poolId: 30,
      description: 'Trabajo'
    });
  });

  it('should handle backend errors', async () => {
    await createComponent();
    laneServiceMock.getLanes.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.filterForm.patchValue({ poolId: 30 });
    component.onPoolChange();

    expect(component.error).toBeTruthy();
    expect(component.lanes).toEqual([]);
  });
});
