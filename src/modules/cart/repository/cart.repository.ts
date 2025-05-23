import { Cart, CartProduct, Product } from '../../../models';

export abstract class CartRepository {
  abstract getCartWithItems(cartId: number): Promise<CartProduct[]>;
  abstract getCartByUserId(userId: number): Promise<Cart | null>;
  abstract addItemToCart(
    cartId: number,
    product: Product,
  ): Promise<CartProduct>;
  abstract removeItemFromCart(
    cartId: number,
    productId: number,
  ): Promise<CartProduct>;
  abstract clearCart(cartId: number): Promise<void>;
  abstract createCart(userId: number): Promise<Cart>;
  abstract getItemFromCart(
    cartId: number,
    productId: number,
  ): Promise<CartProduct | null>;

  abstract updateItemCount(
    cartId: number,
    productId: number,
    count: number,
  ): Promise<CartProduct>;
}
