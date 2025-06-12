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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { GetUser } from '../common/decorator/getUser.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';


@Controller('orders')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiBody({ type: CreateOrderDto })
  async createOrder(
    @GetUser('userId') userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Get()
  async getUserOrders(@GetUser("userId") userId: number) {
    return this.orderService.getOrders(userId);
  }

  @Get(':id')
  getUserOrderById(@GetUser("userId") userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.orderService.getUserOrderById(userId, id);
  }


  @Delete(":id")
  async deleteOrder(@GetUser("userId") userId: number, @Param("id", ParseIntPipe) orderId: number) {

    await this.orderService.cancleOrder(userId, orderId);

    return {
      msg: "Order Removed successfully"
    }
  }

}
