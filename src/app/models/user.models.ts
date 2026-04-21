import { Role } from './role.model';
import { Company } from './company.model';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: Company; 
  isActive: boolean;
}