import { Module } from '@nestjs/common';
import { MikroCategoryRepository } from './repository/mikro-category.repository';
import { CategoryRepository } from './repository/category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: MikroCategoryRepository,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {} 