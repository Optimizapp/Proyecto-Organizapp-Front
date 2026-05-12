export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  companyId: number; 
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  companyId: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  companyId?: number;
}