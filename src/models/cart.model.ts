import { Collection, Entity, ManyToMany, OneToOne, Rel } from '@mikro-orm/core';
import { User } from './user.model';
import { Product } from './product.model';
import { BaseModel } from './base.model';
import { CartProduct } from './cart-product.model';

@Entity({ tableName: 'carts' })
export class Cart extends BaseModel {
  @OneToOne(() => User, {
    fieldName: 'user_id',
    owner: true,
    deleteRule: 'cascade',
  })
  user: Rel<User>;

  @ManyToMany(() => Product, (product) => product.carts, {
    pivotEntity: () => CartProduct,
  })
  products = new Collection<Product>(this);
}
