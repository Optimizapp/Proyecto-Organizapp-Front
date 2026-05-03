export type ProcessVersionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProcessVersionRequest {
  processId: number;
  versionNumber?: number;
  status?: ProcessVersionStatus;
  notes?: string;
}

export interface ProcessVersionResponse {
  id: number;
  processId: number;
  versionNumber: number;
  status?: ProcessVersionStatus;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}
