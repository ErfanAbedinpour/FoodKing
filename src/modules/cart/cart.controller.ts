import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { IsAuth } from '../common/decorator/auth.decorator';
import { GetUser } from '../common/decorator/getUser.decorator';
import { AddItemDto } from './dto/add-item.dto';
import { CartService } from './cart.service';
import { RemoveItemDto } from './dto/remove-item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cart')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('userId') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post()
  async addItemToCart(
    @GetUser('userId') userId: number,
    @Body() body: AddItemDto,
  ) {
    return this.cartService.addItemToCart(userId, body);
  }

  @Delete()
  async removeItemFromCart(
    @GetUser('userId') userId: number,
    @Body() body: RemoveItemDto,
  ) {
    return this.cartService.removeItemFromCart(userId, body);
  }

  @Delete('clear')
  async clearCart(@GetUser('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
