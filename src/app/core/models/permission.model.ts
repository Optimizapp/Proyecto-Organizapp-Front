export interface PermissionRequest {
  roleId: number;
  name: string;
  description?: string;
}

export interface PermissionResponse {
  id: number;
  roleId: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
