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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { CartDTO } from './dto/cart.dto';

@Controller('cart')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiOkResponse({
    description: 'User cart',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { type: 'object', $ref: getSchemaPath(CartDTO) },
        },
        totalPrice: { type: 'number' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Cart is empty',
  })
  async getCart(@GetUser('userId') userId: number) {
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiOkResponse({
    description: 'Item added to cart',
    type: CartDTO,
  })
  @ApiBadRequestResponse({
    description: 'Product not found',
  })
  async addItemToCart(
    @GetUser('userId') userId: number,
    @Body() body: AddItemDto,
  ) {
    return this.cartService.addItemToCart(userId, body);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiOkResponse({
    description: 'Cart cleared',
    schema: { properties: { msg: { type: 'string' } } },
  })
  @ApiNotFoundResponse({
    description: 'Cart not found',
  })
  async clearCart(@GetUser('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiOkResponse({
    description: 'Item removed from cart',
    schema: { properties: { msg: { type: 'string' } } },
  })
  @ApiBadRequestResponse({
    description: 'Product not found',
  })
  async removeItemFromCart(
    @GetUser('userId') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItemFromCart(userId, productId);
  }
}
