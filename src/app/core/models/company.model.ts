import { PoolResponse } from './pool.model';
import { RoleResponse } from './role.model';
import { UserResponse } from './user.model';

export interface CreateCompanyRequest {
  name: string;
  nit: string;
  address: string;
  phone: string;
  industry?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {}

export interface CompanyResponse {
  id: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
  industry?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterCompanyRequest extends CreateCompanyRequest {
  adminName: string;
  adminEmail: string;
}

export interface RegisterCompanyResponse {
  company: CompanyResponse;
  adminUser: UserResponse;
  roles: RoleResponse[];
  defaultPool: PoolResponse;
}

export type Company = CompanyResponse;
