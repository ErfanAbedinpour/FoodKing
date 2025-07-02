import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { CartRepository } from './repository/cart.repository';
import { RepositoryException } from '../common/exception/repository.exception';
import { ProductService } from '../product/product.service';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';
import Decimal from 'decimal.js';
import { Product } from '../../models';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productService: ProductService,
  ) { }

  async getCart(userId: number) {
    try {
      const userCart = await this.cartRepository.getCartByUserId(userId);

      const result = await this.cartRepository.getCartWithItems(userCart!.id);

      if (!result.length)
        throw new NotFoundException(ErrorMessage.CART_IS_EMPTY);

      const totalPrice = result.reduce(
        (acc, item) => acc.plus(Decimal.mul(item.product.price, item.count)),
        new Decimal(0),
      );
      return {
        data: result,
        totalPrice: totalPrice.toNumber(),
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      if (err instanceof RepositoryException) {
        throw new BadRequestException(err.message);
      }
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  addNewItemToCart(cartId: number, product: Product) {
    return this.cartRepository.addItemToCart(cartId, product);
  }

  async addItemToCart(userId: number, { productId }: AddItemDto) {
    try {
      // get user cart
      let userCart =
        (await this.cartRepository.getCartByUserId(userId)) ||
        (await this.cartRepository.createCart(userId));

      const product = await this.productService.getProductById(productId);

      if (product.inventory < 1)
        throw new BadRequestException(ErrorMessage.PRODUCT_OUT_OF_STOCK);

      // check if product is already in cart
      let userCartItem = await this.cartRepository.getItemFromCart(
        userCart.id,
        productId,
      );

      // if product is not in cart, add it
      if (!userCartItem) {
        const result = await this.addNewItemToCart(userCart.id, product);

        return {
          cartId: result.cart.id,
          product: result.product,
          count: result.count,
        };
      }
      // if product is in cart, update item count
      // check if product is out of stock
      if (product.inventory < userCartItem.count + 1)
        throw new BadRequestException(ErrorMessage.PRODUCT_OUT_OF_STOCK);

      // update item count
      const result = await this.updateCartItemCount(
        userCart.id,
        productId,
        userCartItem.count + 1,
      );

      return {
        cartId: result.cart.id,
        product: result.product,
        count: result.count,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      if (err instanceof RepositoryException)
        throw new BadRequestException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  updateCartItemCount(cartId: number, productId: number, count: number) {
    return this.cartRepository.updateItemCount(cartId, productId, count);
  }

  async removeItemFromCart(userId: number, productId: number) {
    try {
      const userCart = await this.cartRepository.getCartByUserId(userId);

      const userCartItem = await this.cartRepository.getItemFromCart(
        userCart!.id,
        productId,
      );

      if (!userCartItem)
        throw new NotFoundException(ErrorMessage.CART_ITEM_NOT_FOUND);

      const product = await this.productService.getProductById(productId);

      userCartItem.count > 1
        ? await this.updateCartItemCount(
          userCart!.id,
          product.id,
          userCartItem.count - 1,
        )
        : await this.cartRepository.removeItemFromCart(userCart!.id, productId);

      return {
        msg: 'Cart updated successfully',
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      if (err instanceof RepositoryException) {
        throw new BadRequestException(err.message);
      }
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async clearCart(userId: number) {
    try {
      const userCart = await this.cartRepository.getCartByUserId(userId);

      if (!userCart) throw new NotFoundException(ErrorMessage.CART_NOT_FOUND);

      await this.cartRepository.clearCart(userCart!.id);

      return {
        msg: 'Cart cleared',
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      if (err instanceof RepositoryException) {
        throw new BadRequestException(err.message);
      }

      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
