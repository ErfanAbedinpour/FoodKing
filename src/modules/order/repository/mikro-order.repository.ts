import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { CartProduct, Order, OrderItem } from '../../../models';
import { OrderStatus, PaymentMethod } from '../../../models/order.model';
import { OrderPersist } from './persist/order.persist';
import Decimal from 'decimal.js';

@Injectable()
export class MikroOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}
  async createOrder({
    addressId,
    paymentMethod,
    products,
    userId,
  }: OrderPersist): Promise<Loaded<Order>> {
    const order = this.em.create(
      Order,
      {
        user: userId,
        status: OrderStatus.Processing,
        address: addressId,
        paymentMethod,
        total_price: products.reduce(
          (acc, product) => acc.plus(product.product.price),
          new Decimal(0),
        ),
      },
      { persist: true },
    );

    for (const { product, count } of products) {
      const orderItem = this.em.create(
        OrderItem,
        {
          order,
          product: product,
          quantity: count,
          price: product.price,
        },
        { persist: true },
      );

      order.products.add(product);
    }

    try {
      await this.em.flush();
      return order;
    } catch (err) {
      throw err;
    }
  }
}
