import { Entity, Enum } from '@mikro-orm/core';
import { BaseModel } from './base.model';

export enum UserRole {
  Customer = 'Customer',
  Delivery = 'Delivery',
  Owner= 'Owner',
}

@Entity({ tableName: 'Role' })
export class Role extends BaseModel {
  @Enum({ items: () => UserRole, unique: true, default: UserRole.Customer })
  name: UserRole;
}
