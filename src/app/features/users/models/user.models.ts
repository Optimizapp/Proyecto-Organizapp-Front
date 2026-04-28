import { Role } from '../../../models/role.models';
import { Company } from '../../companies/models/company.model';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: Company; 
  isActive: boolean;
}
