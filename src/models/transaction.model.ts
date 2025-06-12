import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';
import Decimal from 'decimal.js';
import { Order } from './order.model';
import { BaseModel } from './base.model';

export enum TransactionStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund'
}

export enum Providers {
  ZARINPAL = 'zarinpal',
  ZIPAL = 'zipal',
}

@Entity({ tableName: 'transactions' })
export class Transaction extends BaseModel {
  @Property({ type: 'decimal', columnType: 'numeric(10,2)', nullable: false })
  amount: Decimal;

  @Enum({ items: () => Providers, nullable: false })
  provider: Providers;

  @Property({ nullable: false })
  authority: string;


  @Enum({ items: () => TransactionStatus, default: TransactionStatus.PENDING, nullable: true })
  status?: TransactionStatus;


  @Property({ nullable: true })
  transaction_id?: string;


  @Property({ nullable: false, default: TransactionType.PAYMENT })
  transaction_type?: TransactionType;


  @ManyToOne(() => Order, { fieldName: 'order_id', deleteRule: 'set null' })
  order!: Rel<Order>;
}
