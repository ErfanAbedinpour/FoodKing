import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { Collection, EntityManager, Loaded } from '@mikro-orm/postgresql';
import { Cart, CartProduct, Product } from '../../../models';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class MikroCartRepository implements CartRepository {
  constructor(private readonly em: EntityManager) {}

  async addItemToCart(
    userId: number,
    item: { productId: number; quantity: number },
  ): Promise<Cart> {
    try {
      const cart = await this.em.findOneOrFail(Cart, { user: userId });

      const cartItems = await this.em.find(
        CartProduct,
        { cart: cart.id },
        { populate: ['cart', 'product'] },
      );

      const cartProduct = cartItems.find(
        (cartItem) => cartItem.product.id === item.productId,
      );

      if (!cartProduct) {
        const product = await this.em.findOne(Product, {
          id: item.productId,
        });

        if (!product) {
          throw new RepositoryException('Product not found');
        }

        if (item.quantity > product.inventory) {
          throw new RepositoryException('Inventory is not enough');
        }

        cartItems.push(
          this.em.create(
            CartProduct,
            {
              cart: cart,
              product: item.productId,
              count: item.quantity,
            },
            { persist: true },
          ),
        );
      } else {
        if (cartProduct.count + item.quantity > cartProduct.product.inventory) {
          throw new RepositoryException('Inventory is not enough');
        }

        cartProduct.count += item.quantity;
      }

      await this.em.flush();
      return cart;
    } catch (err) {
      throw err;
    }
  }

  //   clearCart(userId: number): Promise<void> {}

  //   getCartWithItems(userId: number): Promise<Cart> {}

  //   removeItemFromCart(userId: number, itemId: number): Promise<Cart> {}
}
