import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
  Rel,
} from '@mikro-orm/core';
import { User } from './user.model';
import { Product } from './product.model';
import { OrderItem } from './order-item.model';
import { Address } from './address.model';
import Decimal from 'decimal.js';
import { BaseModel } from './base.model';

export enum OrderStatus {
  Processing = 'processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
}

export enum PaymentMethod {
  Online = 'Online',
  Cash = 'Cash',
}

@Entity({ tableName: 'orders' })
export class Order extends BaseModel {
  @Enum({
    items: () => OrderStatus,
    default: OrderStatus.Processing,
    nullable: false,
  })
  status = OrderStatus.Processing;

  @ManyToOne(() => User, { fieldName: 'user_id', deleteRule: 'set null' })
  user: Rel<User>;

  @OneToOne(() => Address, {
    fieldName: 'address_id',
    nullable: false,
    owner: true,
    unique: false,
  })
  address: Address;

  @Property({ nullable: false })
  paymentMethod: PaymentMethod;

  @ManyToMany(() => Product, (product) => product.orders, {
    pivotEntity: () => OrderItem,
    owner: true,
    nullable: false,
  })
  products = new Collection<Product>(this);

  @Property({ type: 'decimal', nullable: false })
  total_price: Decimal;
}
