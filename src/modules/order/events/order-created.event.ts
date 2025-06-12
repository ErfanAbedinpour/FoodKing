import { OrderItem } from '../../../models';

export class OrderCreatedEvent {
  constructor(public readonly orderItems: {productId:number,quantity:number}[], public userId: number) { }
}
