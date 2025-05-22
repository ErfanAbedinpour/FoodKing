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

  async clearCart(userId: number): Promise<void> {
    try {
      const userCart = await this.em.findOneOrFail(Cart, { user: userId });

      const cartItems = await this.em.findAll(CartProduct, {
        where: { cart: userCart },
      });

      await this.em.removeAndFlush(cartItems);
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
      throw err;
    }
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    try {
      const userCart = await this.em.findOneOrFail(Cart, { user: userId });
      return userCart;
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
      throw err;
    }
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
    try {
      const cart = await this.em.findOneOrFail(Cart, { user: userId });

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
        throw new RepositoryException(ErrorMessage.CART_NOT_FOUND);
      throw err;
    }
  }
}
