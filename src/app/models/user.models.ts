import { Role } from './role.models';
import { Company } from './company.models';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: Company; 
  isActive: boolean;
}