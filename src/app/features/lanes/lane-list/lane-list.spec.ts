import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
    updateLane: ReturnType<typeof vi.fn>;
  };

  const companies: CompanyResponse[] = [
    { id: 10, name: 'Acme', nit: '900', address: 'Main', phone: '555' }
  ];
  const pools: PoolResponse[] = [
    { id: 30, name: 'Pool principal', companyId: 10 }
  ];
  const lanes: LaneResponse[] = [
    { id: 40, name: 'Lane inicial', poolId: 30, description: 'Base' },
    { id: 41, name: 'Lane revision', poolId: 30, description: 'Revision' },
    { id: 42, name: 'Lane cierre', poolId: 30, description: 'Cierre' }
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
      createLane: vi.fn(() => of(lanes[0])),
      updateLane: vi.fn(() => of(lanes[0]))
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

  it('should reorder lanes locally without persisting', async () => {
    await createComponent();
    component.lanes = [...lanes];
    vi.clearAllMocks();

    component.dropLane({
      previousIndex: 0,
      currentIndex: 2
    } as CdkDragDrop<LaneResponse[]>);

    expect(component.lanes.map((lane) => lane.id)).toEqual([41, 42, 40]);
    expect(laneServiceMock.getLanes).not.toHaveBeenCalled();
    expect(laneServiceMock.createLane).not.toHaveBeenCalled();
    expect(laneServiceMock.updateLane).not.toHaveBeenCalled();
    expect(poolServiceMock.getPools).not.toHaveBeenCalled();
    expect(companyServiceMock.getCompanies).not.toHaveBeenCalled();
  });

  it('should render the drop list container without requiring persisted order', async () => {
    await createComponent();

    expect(fixture.nativeElement.querySelector('[cdkDropList]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Arrastra una lane');
  });

  it('should show the local order warning only when lanes are visible', async () => {
    await createComponent();

    expect(fixture.nativeElement.textContent).not.toContain('El orden se actualiza solo visualmente en esta versión.');

    component.filterForm.controls.poolId.enable();
    component.filterForm.patchValue({ poolId: 30 });
    component.lanes = [...lanes];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('El orden se actualiza solo visualmente en esta versión.');

    component.lanes = [];
    component.filterForm.patchValue({ poolId: null });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('El orden se actualiza solo visualmente en esta versión.');
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
