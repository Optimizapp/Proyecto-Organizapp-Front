export interface CreatePoolRequest {
  name: string;
  companyId: number;
  description?: string;
}

export interface UpdatePoolRequest extends Partial<CreatePoolRequest> {}

export interface PoolResponse {
  id: number;
  name: string;
  companyId: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
