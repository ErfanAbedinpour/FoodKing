import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartRepository } from './repository/cart.repository';
import { MikroCartRepository } from './repository/mikro-product.repository';

@Module({
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
