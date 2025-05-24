import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IsAuth } from '../common/decorator/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { GetUser } from '../common/decorator/getUser.decorator';

@Controller('orders')
@IsAuth()
@ApiBearerAuth('JWT-AUTH')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@GetUser('userId') userId: number) {
    return this.orderService.createOrder(userId);
  }

  @Get()
  async getOrders() {
    return this.orderService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: string) {
    return this.orderService.getOrderById(id);
  }
}
