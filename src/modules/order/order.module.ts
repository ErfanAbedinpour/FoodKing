import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MikroOrderRepository } from './repository/mikro-order.repository';
import { OrderRepository } from './repository/order.repository';
import { AddressModule } from '../address/address.module';

@Module({
  imports:[AddressModule,],
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
export class OrderModule {}
