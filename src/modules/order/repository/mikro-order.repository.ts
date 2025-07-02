import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { EntityManager, Loaded, wrap } from '@mikro-orm/postgresql';
import { Order, OrderItem } from '../../../models';
import { OrderStatus } from '../../../models/order.model';
import { OrderPersist } from './persist/order.persist';
import Decimal from 'decimal.js';
import { NotFoundError } from 'rxjs';
import { RepositoryException } from '../../common/exception/repository.exception';
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


    const orderItems: OrderItem[] = []
    const order = this.em.create(
      Order,
      {
        user: userId,
        status: OrderStatus.Processing,
        address: addressId,
        paymentMethod,
        total_price: products.reduce(
          (acc, { price, quantity }) => acc.plus(Decimal.mul(price, quantity)),
          new Decimal(0),
        ),
      },
      { persist: true },
    );

    for (const { productId, quantity, price } of products) {

      const orderItem = this.em.create(OrderItem, {
        order: order,
        product: productId,
        quantity: quantity,
        price: price,
      }, { persist: true })

      orderItems.push(orderItem);
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


  async cancleOrder(orderId: number): Promise<void> {
    try {
      const order = await this.em.findOneOrFail(Order, orderId);
      wrap(order).assign({ status: OrderStatus.Cancelled });
      await this.em.flush();
      return;
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.ORDER_NOT_FOUND)
      throw err;
    }
  }

  async getUserOrderById(userId: number, orderId: number): Promise<Loaded<Order> | null> {
    const userOrder = await this.em.findOne(Order, { user: userId, id: orderId }, { populate: ['products', 'address'] });
    return userOrder;
  }



  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.em.findOne(Order, orderId);
    if (!order) throw new RepositoryException(ErrorMessage.ORDER_NOT_FOUND)
    order.status = status;
    try {
      await this.em.flush();
      return order as Order;

    } catch (err) {
      throw err;
    }
  }
}

