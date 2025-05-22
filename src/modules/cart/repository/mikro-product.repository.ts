import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { EntityManager, Loaded, NotFoundError } from '@mikro-orm/postgresql';
import { Cart, CartProduct, Product } from '../../../models';
import { RepositoryException } from '../../../exception/repository.exception';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';

@Injectable()
export class MikroCartRepository implements CartRepository {
  constructor(private readonly em: EntityManager) {}

  async addItemToCart(cartId: number, product: Product): Promise<CartProduct> {
    try {
      const cartProduct = this.em.create(CartProduct, {
        cart: cartId,
        product: product,
        count: 1,
      });

      await this.em.persistAndFlush(cartProduct);
      return cartProduct;
    } catch (err) {
      throw err;
    }
  }

  async clearCart(cartId: number): Promise<void> {
    try {
      const cartItems = await this.em.findAll(CartProduct, {
        where: { cart: cartId },
      });

      await this.em.removeAndFlush(cartItems);
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
      throw err;
    }
  }

  async getCartByUserId(userId: number): Promise<Cart | null> {
    const userCart = await this.em.findOne(Cart, { user: userId });
    return userCart;
  }

  async getCartWithItems(cartId: number): Promise<CartProduct[]> {
    try {
      const items = await this.em.findAll(CartProduct, {
        where: { cart: cartId },
        populate: ['product'],
      });

      return items;
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
      throw err;
    }
  }

  async removeItemFromCart(userId: number, productId: number): Promise<Cart> {
    const cart = await this.getCartByUserId(userId);
    if (!cart) throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
    try {
      const cartItem = await this.em.findOneOrFail(CartProduct, {
        cart: cart,
        product: productId,
      });

      if (cartItem.count > 1) {
        cartItem.count--;
        await this.em.persistAndFlush(cartItem);
      } else {
        await this.em.removeAndFlush(cartItem);
      }

      return cart;
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.CART_ITEM_NOT_FOUND);
      throw err;
    }
  }

  async createCart(userId: number): Promise<Cart> {
    const cart = this.em.create(Cart, {
      user: userId,
    });
    try {
      await this.em.persistAndFlush(cart);
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async getItemFromCart(
    cartId: number,
    productId: number,
  ): Promise<CartProduct | null> {
    const item = await this.em.findOne(
      CartProduct,
      {
        cart: cartId,
        product: productId,
      },
      { populate: ['product'] },
    );
    return item;
  }

  async updateItemCount(
    cartId: number,
    productId: number,
    count: number,
  ): Promise<CartProduct> {
    try {
      const cartProduct = await this.em.findOneOrFail(CartProduct, {
        cart: cartId,
        product: productId,
      });

      cartProduct.count = count;
      await this.em.persistAndFlush(cartProduct);
      return cartProduct;
    } catch (err) {
      throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
    }
  }
}
