import { Entity, ManyToOne } from '@mikro-orm/core';
import { Product } from './product.model';
import { Category } from './category.model';

@Entity({ tableName: 'product-category' })
export class ProductCategory {
  @ManyToOne(() => Product, { primary: true })
  product: Product;

  @ManyToOne(() => Category, { primary: true })
  category: Category;
}
