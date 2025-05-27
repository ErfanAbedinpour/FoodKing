import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CartService } from '../cart/cart.service';
import { AddressService } from '../address/address.service';
import { OrderStatus, PaymentMethod } from '../../models/order.model';

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
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
  ) {}

  async createOrder(
    userId: number,
    { addressId, paymentMethod }: CreateOrderDto,
  ) {
    /**
     * TODO: If PaymentMethod is Online, create a payment Link
     * TODO: If PaymentMethod is Cash, create a An Order with status Processing
     */

    /**
     *1. Fetch UserCartProduct
     * 3. fetch UserAddress
     * 5. Store Order
     */

    const [userCartProducts, _] = await Promise.all([
      this.cartService.getCart(userId),
      this.addressService.findOne(userId, addressId),
    ]);
    try {
      const order = await this.orderRepository.createOrder({
        addressId: addressId,
        products: userCartProducts.data,
        paymentMethod,
        userId,
      });

      if (paymentMethod === PaymentMethod.Cash) {
        return order;
      }

      // TODO: Create a payment Link
      // const paymentLink = await this.paymentService.createPaymentLink(order);
      return order;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }

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
