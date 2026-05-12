import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserResponse } from '../../../core/models';
import { UserService } from '../../../services/user.service';
import { UserList } from './user-list';

describe('UserList', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;
  let userServiceMock: {
    getUsers: ReturnType<typeof vi.fn>;
  };

  const users: UserResponse[] = [
    {
      id: 1,
      name: 'Ana Gomez',
      email: 'ana@example.com',
      companyId: 10,
      roleId: 20,
      active: true
    }
  ];

  async function createComponent(response = of(users)): Promise<void> {
    userServiceMock = {
      getUsers: vi.fn(() => response)
    };

    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and load users', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(users);
    expect(fixture.nativeElement.textContent).toContain('Ana Gomez');
  });

  it('should show an empty state', async () => {
    await createComponent(of([]));

    expect(component.users).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No hay usuarios registrados.');
  });

  it('should handle backend errors', async () => {
    await createComponent(throwError(() => new HttpErrorResponse({ status: 500 })));

    expect(component.error).toBeTruthy();
    expect(component.users).toEqual([]);
  });

  it('should expose navigation to create a user', async () => {
    await createComponent();

    const link = fixture.debugElement.query(By.css('a[routerLink="/users/new"]'));
    expect(link).toBeTruthy();
  });
});
