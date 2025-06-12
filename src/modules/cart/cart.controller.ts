import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IsAuth } from '../common/decorator/auth.decorator';
import { GetUser } from '../common/decorator/getUser.decorator';
import { AddItemDto } from './dto/add-item.dto';
import { CartService } from './cart.service';
import {
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddItemToCartSwagger, ClearCartSwagger, GetUserCartSwagger, RemoveItemFromCartSwagger } from './cart.swagger';

@Controller('cart')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @GetUserCartSwagger()
  async getCart(@GetUser('userId') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post()
  @AddItemToCartSwagger()
  async addItemToCart(
    @GetUser('userId') userId: number,
    @Body() body: AddItemDto,
  ) {
    return this.cartService.addItemToCart(userId, body);
  }

  @Delete('clear')
  @ClearCartSwagger()
  async clearCart(@GetUser('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }

  @Delete(':productId')
  @RemoveItemFromCartSwagger() 
  async removeItemFromCart(
    @GetUser('userId') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItemFromCart(userId, productId);
  }
}
