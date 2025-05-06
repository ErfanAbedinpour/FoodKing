import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from '@mikro-orm/core';
import { User } from './user.model';
import Decimal from 'decimal.js';
import { BaseModel } from './base.model';
import { Category } from './category.model';
import { Cart } from './cart.model';
import { CartProduct } from './cart-product.model';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Restaurant } from './restaurant.model';
import { Comment } from './comment.model';
import { ProductAttribute } from './product-attribute.model';
import { ProductCategory } from './product-category.model';

@Entity({ tableName: 'products' })
export class Product extends BaseModel {
  @Property({ length: 50 })
  name!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property({ unique: true })
  slug!: string;

  @Property()
  inventory!: number;

  @ManyToOne(() => User, {
    fieldName: 'user_id',
    nullable: false,
    deleteRule: 'set null',
  })
  user!: Rel<User>;

  @Property({ type: 'decimal', columnType: 'numeric(10,2)', nullable: false })
  price!: Decimal;

  @OneToMany(() => ProductCategory, (cp) => cp.product)
  category = new Collection<ProductCategory>(this);

  @ManyToMany(() => Cart, (cart) => cart.products, {
    pivotEntity: () => CartProduct,
    owner: true,
  })
  carts = new Collection<Cart>(this);

  @ManyToMany(() => Order, (order) => order.products, {
    pivotEntity: () => OrderItem,
  })
  orders = new Collection<Order>(this);

  @OneToMany(() => ProductAttribute, (attr) => attr.product)
  attributes = new Collection<ProductAttribute>(this);

  @OneToMany(() => Comment, (comment) => comment.product)
  comments = new Collection<Comment>(this);

  @ManyToOne(() => Restaurant, {
    fieldName: 'restaurant_id',
    deleteRule: 'cascade',
    updateRule: 'cascade',
    nullable: false,
  })
  restaurant: Rel<Restaurant>;

  @Property({ default: true, nullable: false })
  is_active: boolean;
}
