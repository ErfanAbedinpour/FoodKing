import { Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseModel } from './base.model';
import { Product, User } from '.';

@Entity({ tableName: 'Restaurant' })
export class Restaurant extends BaseModel {
  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false })
  en_name: string;

  @OneToMany(() => Product, (p) => p.restaurant,{nullable:false})
  products? = new Collection<Product>(this);

  @ManyToOne(()=>User,{nullable:false,deleteRule:'cascade',updateRule:'cascade'})
  ownerId!:User
}
