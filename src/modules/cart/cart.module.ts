import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartRepository } from './repository/cart.repository';
import { MikroCartRepository } from './repository/mikro-product.repository';
import { CartController } from './cart.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CartRepository,
      useClass: MikroCartRepository,
    },
  ],
  exports: [CartService],
})
export class CartModule {}
