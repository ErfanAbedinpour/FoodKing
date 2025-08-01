import { Product } from '@models/product.model';
import { ProductPersist } from './persistance/product';
import { Loaded } from '@mikro-orm/core';

export abstract class ProductRepository {
  abstract create(product: ProductPersist): Promise<Product>;

  abstract findById(id: number): Promise<Product>;

  abstract findBySlug(slug: string): Promise<Loaded<Product>>;

  abstract getAll(): Promise<Product[]>;

  abstract delete(id: number): Promise<Product>;

  abstract update(
    id: number,
    data: Partial<Omit<ProductPersist, 'user_id'>>,
  ): Promise<Product>;
}
