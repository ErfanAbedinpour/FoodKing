import { Injectable } from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';

@Injectable()
export class CartService {
  async getCart(userId: number) {
    return 'Cart';
  }

  async addItemToCart(userId: number, body: AddItemDto) {
    return 'Cart';
  }

  async removeItemFromCart(userId: number, body: RemoveItemDto) {
    return 'Cart';
  }

  async clearCart(userId: number) {
    return 'Cart';
  }
}
