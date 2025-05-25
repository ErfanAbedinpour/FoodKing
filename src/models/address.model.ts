import { Entity, ManyToOne, OneToOne, Property, Rel } from '@mikro-orm/core';
import { BaseModel } from './base.model';
import { User } from './user.model';

@Entity({ tableName: 'Address' })
export class Address extends BaseModel {
  @Property()
  zip_code!: string;

  @Property({ type: 'text' })
  street!: string;

  @Property({ type: 'text' })
  city!: string;

  @Property({ type: 'text' })
  state!: string;

  @Property({ nullable: true })
  latitude?: number;

  @Property({ nullable: true })
  longitude?: number;

  @ManyToOne(() => User)
  user: Rel<User>;
}
