export type ProcessStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface CreateProcessRequest {
  name: string;
  description?: string;
  category?: string;
  status?: ProcessStatus;
  companyId: number;
  userId: number;
  mainPoolId: number;
}

export interface UpdateProcessRequest extends Partial<CreateProcessRequest> {}

export interface ProcessResponse {
  id: number;
  name: string;
  description?: string;
  category?: string;
  status: ProcessStatus;
  companyId: number;
  userId: number;
  mainPoolId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type Process = ProcessResponse;
