export interface Company {
  id: number;
  name: string;
  nit: string;
  industry: string;
}

export interface CompanyRequest {
  name: string;
  nit: string;
  industry?: string;
}