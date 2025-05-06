import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { MikroProductRepository } from "./repository/mikro-product.repository";
import { ProductRepository } from "./repository/product.repository";

@Module({
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