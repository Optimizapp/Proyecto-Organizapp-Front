export interface Process {
  id: number;
  name: string;
  description?: string;
  status?: string;
  companyId?: number;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}
