import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CompanyResponse, RoleResponse, UserResponse } from '../../../core/models';
import { CompanyService } from '../../../services/company.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { UserForm } from './user-form';

describe('UserForm', () => {
  let component: UserForm;
  let fixture: ComponentFixture<UserForm>;
  let router: Router;
  let userServiceMock: {
    getUserById: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
  };
  let companyServiceMock: {
    getCompanies: ReturnType<typeof vi.fn>;
  };
  let roleServiceMock: {
    getRoles: ReturnType<typeof vi.fn>;
  };

  const companies: CompanyResponse[] = [
    { id: 10, name: 'Acme', nit: '900', address: 'Main', phone: '555' }
  ];
  const roles: RoleResponse[] = [
    { id: 20, name: 'ADMIN', companyId: 10, processId: null }
  ];
  const user: UserResponse = {
    id: 1,
    name: 'Ana Gomez',
    email: 'ana@example.com',
    companyId: 10,
    roleId: 20,
    active: true
  };

  async function createComponent(id?: string): Promise<void> {
    userServiceMock = {
      getUserById: vi.fn(() => of(user)),
      createUser: vi.fn(() => of(user)),
      updateUser: vi.fn(() => of(user))
    };
    companyServiceMock = {
      getCompanies: vi.fn(() => of(companies))
    };
    roleServiceMock = {
      getRoles: vi.fn(() => of(roles))
    };

    await TestBed.configureTestingModule({
      imports: [UserForm],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: CompanyService, useValue: companyServiceMock },
        { provide: RoleService, useValue: roleServiceMock },
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

    fixture = TestBed.createComponent(UserForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and load companies', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(companyServiceMock.getCompanies).toHaveBeenCalled();
    expect(component.companies).toEqual(companies);
  });

  it('should start with roleId disabled', async () => {
    await createComponent();

    expect(component.userForm.controls.roleId.disabled).toBe(true);
  });

  it('should load roles when selecting a company', async () => {
    await createComponent();

    component.userForm.patchValue({ companyId: '10' as unknown as number, roleId: 20 });
    component.onCompanyChange();
    fixture.detectChanges();

    expect(component.userForm.value.roleId).toBeNull();
    expect(roleServiceMock.getRoles).toHaveBeenCalledWith({ companyId: 10 });
    expect(component.roles).toEqual(roles);
    expect(component.userForm.controls.roleId.enabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('ADMIN');
  });

  it('should disable roleId when clearing company', async () => {
    await createComponent();

    component.userForm.patchValue({ companyId: 10 });
    component.onCompanyChange();
    expect(component.userForm.controls.roleId.enabled).toBe(true);

    component.userForm.patchValue({ companyId: null, roleId: 20 });
    component.onCompanyChange();

    expect(component.userForm.getRawValue().roleId).toBeNull();
    expect(component.roles).toEqual([]);
    expect(component.userForm.controls.roleId.disabled).toBe(true);
  });

  it('should not submit without roleId', async () => {
    await createComponent();

    component.userForm.setValue({
      name: 'Ana Gomez',
      email: 'ana@example.com',
      password: '',
      companyId: 10,
      roleId: null,
      active: true
    });
    component.saveUser();

    expect(component.userForm.invalid).toBe(true);
    expect(component.userForm.controls.roleId.enabled).toBe(true);
    expect(userServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('should expose role loading errors', async () => {
    await createComponent();
    roleServiceMock.getRoles.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    component.userForm.patchValue({ companyId: 10, roleId: 20 });
    component.onCompanyChange();

    expect(component.roles).toEqual([]);
    expect(component.userForm.getRawValue().roleId).toBeNull();
    expect(component.error).toBeTruthy();
  });

  it('should not submit an invalid form', async () => {
    await createComponent();

    component.saveUser();

    expect(component.userForm.invalid).toBe(true);
    expect(userServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('should create a user with companyId and roleId', async () => {
    await createComponent();

    component.userForm.setValue({
      name: 'Ana Gomez',
      email: 'ana@example.com',
      password: 'Segura123',
      companyId: 10,
      roleId: 20,
      active: true
    });
    component.saveUser();

    expect(userServiceMock.createUser).toHaveBeenCalledWith({
      name: 'Ana Gomez',
      email: 'ana@example.com',
      password: 'Segura123',
      companyId: 10,
      roleId: 20
    });
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should load and update a user in edit mode', async () => {
    await createComponent('1');

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(1);
    expect(roleServiceMock.getRoles).toHaveBeenCalledWith({ companyId: 10 });
    component.userForm.patchValue({ name: 'Ana Actualizada' });
    component.saveUser();

    expect(userServiceMock.updateUser).toHaveBeenCalledWith(1, {
      name: 'Ana Actualizada',
      email: 'ana@example.com',
      companyId: 10,
      roleId: 20,
      active: true
    });
  });

  it('should require password in create mode', async () => {
    await createComponent();

    component.userForm.setValue({
      name: 'Ana Gomez',
      email: 'ana@example.com',
      password: '',
      companyId: 10,
      roleId: 20,
      active: true
    });
    component.saveUser();

    expect(component.userForm.controls.password.invalid).toBe(true);
    expect(userServiceMock.createUser).not.toHaveBeenCalled();
  });

  it('should not require or send password in edit mode', async () => {
    await createComponent('1');

    component.userForm.patchValue({ password: '', name: 'Ana Actualizada' });
    component.saveUser();

    expect(component.userForm.controls.password.valid).toBe(true);
    expect(userServiceMock.updateUser).toHaveBeenCalledWith(1, {
      name: 'Ana Actualizada',
      email: 'ana@example.com',
      companyId: 10,
      roleId: 20,
      active: true
    });
  });

  it('should handle backend errors', async () => {
    await createComponent();
    userServiceMock.createUser.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 400 })));
    component.userForm.setValue({
      name: 'Ana Gomez',
      email: 'ana@example.com',
      password: 'Segura123',
      companyId: 10,
      roleId: 20,
      active: true
    });

    component.saveUser();

    expect(component.error).toBeTruthy();
  });

  it('should expose password backend field errors', async () => {
    await createComponent();
    userServiceMock.createUser.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: {
              timestamp: '2026-05-12T00:00:00.000Z',
              status: 400,
              error: 'Bad Request',
              message: 'Datos invalidos',
              path: '/api/users',
              fields: {
                password: 'La contrasena es obligatoria'
              }
            }
          })
      )
    );
    component.userForm.setValue({
      name: 'Ana Gomez',
      email: 'ana@example.com',
      password: 'Segura123',
      companyId: 10,
      roleId: 20,
      active: true
    });

    component.saveUser();

    expect(component.fieldErrors['password']).toBe('La contrasena es obligatoria');
  });
});
