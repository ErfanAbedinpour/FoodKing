import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { User } from './user.model';
import { Product } from './product.model';
import { BaseModel } from './base.model';

@Entity({ tableName: 'comments' })
export class Comment extends BaseModel {
  @Property({ type: 'text' })
  body: string;

  @Property({ nullable: false })
  rating: number;

  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @ManyToOne(() => Product, { fieldName: 'product_id', deleteRule: 'set null' })
  product!: Rel<Product>;
}

export enum EntityType {
  ARTICLES = 'articles',
  PRODUCT = 'product',
}
