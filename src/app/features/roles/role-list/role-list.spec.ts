import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CompanyResponse, RoleResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { RoleService } from '../../../services/role.service';
import { RoleList } from './role-list';

describe('RoleList', () => {
  let component: RoleList;
  let fixture: ComponentFixture<RoleList>;
  let companyServiceMock: {
    getCompanies: ReturnType<typeof vi.fn>;
  };
  let roleServiceMock: {
    getRoles: ReturnType<typeof vi.fn>;
    createRole: ReturnType<typeof vi.fn>;
  };

  const companies: CompanyResponse[] = [
    { id: 10, name: 'Acme', nit: '900', address: 'Main', phone: '555' }
  ];
  const roles: RoleResponse[] = [
    { id: 20, name: 'ADMIN', companyId: 10, processId: null }
  ];

  async function createComponent(): Promise<void> {
    companyServiceMock = {
      getCompanies: vi.fn(() => of(companies))
    };
    roleServiceMock = {
      getRoles: vi.fn(() => of(roles)),
      createRole: vi.fn(() => of(roles[0]))
    };

    await TestBed.configureTestingModule({
      imports: [RoleList],
      providers: [
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: RoleService, useValue: roleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should load companies', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(companyServiceMock.getCompanies).toHaveBeenCalled();
    expect(component.companies).toEqual(companies);
  });

  it('should load roles by company', async () => {
    await createComponent();

    component.filterForm.patchValue({ companyId: 10 });
    component.onCompanyChange();

    expect(roleServiceMock.getRoles).toHaveBeenCalledWith({ companyId: 10 });
    expect(component.roles).toEqual(roles);
  });

  it('should create a company role', async () => {
    await createComponent();

    component.filterForm.patchValue({ companyId: 10 });
    component.roleForm.patchValue({ name: 'MANAGER' });
    component.createRole();

    expect(roleServiceMock.createRole).toHaveBeenCalledWith({
      name: 'MANAGER',
      companyId: 10,
      processId: null
    });
  });

  it('should handle backend errors', async () => {
    await createComponent();
    roleServiceMock.getRoles.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.filterForm.patchValue({ companyId: 10 });
    component.onCompanyChange();

    expect(component.error).toBeTruthy();
    expect(component.roles).toEqual([]);
  });
});
