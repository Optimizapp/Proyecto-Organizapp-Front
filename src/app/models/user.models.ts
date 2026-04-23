export interface User {
  id: string;
  name: string;
  email: string;
  roleId: number;
  roleName: string; 
  companyId: number;
  createdAt: string;
}
export interface UserRequest {
  name: string;
  email: string;
  roleId?: number;
  companyId: number;
}