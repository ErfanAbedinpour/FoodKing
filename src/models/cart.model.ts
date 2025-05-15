import { Collection, Entity, ManyToMany, OneToOne, Rel } from '@mikro-orm/core';
import { User } from './user.model';
import { Product } from './product.model';
import { BaseModel } from './base.model';
import { CartProduct } from './cart-product.model';

@Entity({ tableName: 'carts' })
export class Cart extends BaseModel {
  @OneToOne(() => User,user=>user.cart, {
    fieldName: 'user_id',
    owner: true,
    deleteRule: 'cascade',
  })
  user: User;

  @ManyToMany(() => Product, (product) => product.carts, {
    pivotEntity: () => CartProduct,
  })
  products = new Collection<Product>(this);
}
