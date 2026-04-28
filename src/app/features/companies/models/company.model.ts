export interface Company {
  id?: number;           
  name: string;
  nit: string;
  address: string;
  phone: string;
  industry?: string;     
  createdAt?: Date;
}