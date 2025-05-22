import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { CartRepository } from './repository/cart.repository';
import { RepositoryException } from '../../exception/repository.exception';
import { ProductService } from '../product/product.service';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productService: ProductService,
  ) {}

  async getCart(userId: number) {
    try {
      const userCart = await this.cartRepository.getCartByUserId(userId);

      const result = await this.cartRepository.getCartWithItems(userCart!.id);
      return result;
    } catch (err) {
      if (err instanceof RepositoryException) {
        throw new BadRequestException(err.message);
      }
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
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
        const result = await this.cartRepository.addItemToCart(
          userCart.id,
          product,
        );

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
      const result = await this.cartRepository.updateItemCount(
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
      if (err instanceof RepositoryException) {
        throw new BadRequestException(err.message);
      }
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async removeItemFromCart(userId: number, { productId }: RemoveItemDto) {
    try {
      const userCart = await this.cartRepository.getCartByUserId(userId);
      await this.cartRepository.removeItemFromCart(userCart!.id, productId);

      return {
        msg: 'Item removed from cart',
      };
    } catch (err) {
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
      await this.cartRepository.clearCart(userCart!.id);

      return {
        msg: 'Cart cleared',
      };
    } catch (err) {
      if (err instanceof RepositoryException) {
        throw new BadRequestException(err.message);
      }

      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
