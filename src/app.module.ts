import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { join } from 'path';
import { cwd } from 'process';
import { ForkEntityManagerMiddleware } from './middleware/fork.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { CommonModule } from './modules/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './modules/product/product.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { AddressModule } from './modules/address/address.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './modules/order/order.module';
import { StorageModule } from './modules/storage/storage.module';
import { Directory } from './modules/storage/enum/directory.enum';
import { PaymentModule } from './modules/payment/payment.module';
import {CommentModule} from './modules/comment/comment.module'

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: join(cwd(), '.env'),
      cache: true,
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    MenuModule,
    CommonModule,
    ProductModule,
    RestaurantModule,
    CategoryModule,
    CartModule,
    AddressModule,
    OrderModule,
    StorageModule.register({ directory: Directory.Products }),
    PaymentModule,
    CommentModule
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ForkEntityManagerMiddleware).forRoutes('*');
  }
}
