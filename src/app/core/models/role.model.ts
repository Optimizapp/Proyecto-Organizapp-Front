export const BASE_ROLE_NAMES = ['ADMIN', 'MANAGER', 'USER'] as const;

export type BaseRoleName = (typeof BASE_ROLE_NAMES)[number];

export interface RoleRequest {
  nombre: string;
  companyId?: number;
  processId?: number | null;
}

export interface RoleResponse {
  id: number;
  name: string;
  companyId?: number;
  processId: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export type Role = RoleResponse;
