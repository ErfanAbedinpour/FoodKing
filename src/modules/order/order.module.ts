import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MikroOrderRepository } from './repository/mikro-order.repository';
import { OrderRepository } from './repository/order.repository';
import { AddressModule } from '../address/address.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [AddressModule, ProductModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: MikroOrderRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule { }
