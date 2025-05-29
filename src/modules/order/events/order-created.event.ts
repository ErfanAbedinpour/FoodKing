import { OrderItem } from '../../../models';

export class OrderCreatedEvent {
  constructor(public readonly orderItems: OrderItem[], public userId: number) { }
}
