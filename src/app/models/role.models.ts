export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  processId: number;
}
export interface RoleRequest {
  nombre: string;
  descripcion: string;
  processId: number;
}