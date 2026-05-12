export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  companyId: number;
  roleId: number;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  active?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  companyId: number;
  roleId: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type User = UserResponse;
