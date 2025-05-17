import { Cart } from '../../../models';

export abstract class CartRepository {
  abstract getCartWithItems(userId: number): Promise<Cart>;
  abstract addItemToCart(
    userId: number,
    item: { productId: number; quantity: number },
  ): Promise<Cart>;
  abstract removeItemFromCart(userId: number, itemId: number): Promise<Cart>;
  abstract clearCart(userId: number): Promise<void>;
}
