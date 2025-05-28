import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { CartProduct, Order, OrderItem } from '../../../models';
import { OrderStatus, PaymentMethod } from '../../../models/order.model';
import { OrderPersist } from './persist/order.persist';
import Decimal from 'decimal.js';
import { NotFoundError } from 'rxjs';
import { RepositoryException } from '../../../exception/repository.exception';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';

@Injectable()
export class MikroOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) { }
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


  async getAllUserOrder(userId: number): Promise<Order[]> {
    const orders = await this.em.findAll(Order, { where: { user: userId } });
    return orders;
  }

  async getOrderById(orderId: number): Promise<Loaded<Order> | null> {
    const order = await this.em.findOne(Order, orderId, { populate: ['products', 'address'] });
    return order;
  }


  async deleteOrder(orderId: number): Promise<Order> {
    try {
      const order = await this.em.findOneOrFail(Order, orderId);
      await this.em.removeAndFlush(order)
      return order;
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.ORDER_NOT_FOUND)
      throw err;
    }
  }

  async getUserOrder(userId: number, orderId: number): Promise<Loaded<Order> | null> {
    const userOrder = await this.em.findOne(Order, { user: userId, id: orderId }, { populate: ['products', 'address'] });
    return userOrder;
  }
}

