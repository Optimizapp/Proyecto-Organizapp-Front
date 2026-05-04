import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../core/models';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const user: UserResponse = {
    id: 1,
    name: 'Admin',
    email: 'admin@optimizapp.com',
    companyId: 2,
    roleId: 3,
    active: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get users', () => {
    service.getUsers().subscribe((users) => {
      expect(users).toEqual([user]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush([user]);
  });

  it('should get a user by id', () => {
    service.getUserById(1).subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush(user);
  });

  it('should create a user', () => {
    const request: CreateUserRequest = {
      name: 'Admin',
      email: 'admin@optimizapp.com',
      companyId: 2,
      roleId: 3
    };

    service.createUser(request).subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(user);
  });

  it('should update a user', () => {
    const request: UpdateUserRequest = {
      name: 'Admin Updated',
      active: false
    };
    const response: UserResponse = { ...user, ...request };

    service.updateUser(1, request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
