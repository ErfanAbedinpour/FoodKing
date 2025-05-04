import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../models';

export const ROLE_ACCESS = 'RoleAccess';
export const RoleAccess = (...role: UserRole[]) =>
  SetMetadata(ROLE_ACCESS, role);
