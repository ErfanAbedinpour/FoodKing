import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { MikroProductRepository } from "./repository/mikro-product.repository";
import { ProductRepository } from "./repository/product.repository";
import { ProductController } from "./product.controller";
import { CategoryModule } from "../category/category.module";
import { RestaurantModule } from "../restaurant/restaurant.module";
import { StorageModule } from "../storage/storage.module";
import { Directory } from "../storage/enum/directory.enum";

@Module({
  imports:[CategoryModule,RestaurantModule,StorageModule.register({directory:Directory.Products})],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: MikroProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}