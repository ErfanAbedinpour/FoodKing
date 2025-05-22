import { Cart, CartProduct, Product } from '../../../models';

export abstract class CartRepository {
  abstract getCartWithItems(userId: number): Promise<CartProduct[]>;
  abstract getCartByUserId(userId: number): Promise<Cart>;
  abstract addItemToCart(
    userId: number,
    product: Product,
  ): Promise<CartProduct>;
  abstract removeItemFromCart(userId: number, productId: number): Promise<Cart>;
  abstract clearCart(userId: number): Promise<void>;
}
