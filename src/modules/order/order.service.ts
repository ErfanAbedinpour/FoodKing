import { Injectable } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CartService } from '../cart/cart.service';

/**
 * 
 * POST /api/v1/order 
 * {
 *    paymentMethod = "Catch" | "online"
 *    addressId
 *    
 * }
 * if Payment method is Online =>{
 *      1. Create Order  => status=Waiting for payment
 *      2. Create Payment URL
 *      3. After Payment is Complete Product Status should changed to Processing. 
 *      4. Emit OrderCreated Event
 * }
 * if Payment method is catch => OrderCreated  and set status to Processing=> Emit Order.created Event For Decrease product quantity
 */


@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository, private readonly cartService: CartService) { }

  async createOrder(userId: number, { addressId, paymentMethod }: CreateOrderDto) {
    /**
     * TODO: If PaymentMethod is Online, create a payment Link
     * TODO: If PaymentMethod is Cash, create a An Order with status Processing
     */

    /**
     *1. Fetch UserCartProduct
     * 3. fetch UserAddress
     * 5. Store Order
     */

    // const userCartProducts = await this.cartService.getCart(userId);
    // const userAddress = await this.addressService.getAddress(addressId);

    // if (paymentMethod === PaymentMethod.Cash) {
    //   // doing Catch  approach
    // }
    return 'createOrder';
  }

  getOrders() {
    return 'getOrders';
  }

  getOrderById(id: string) {
    return `getOrderById ${id}`;
  }
}
