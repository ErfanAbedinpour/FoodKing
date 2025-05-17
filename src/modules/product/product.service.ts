import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { Product } from '@models/product.model';
import { NotFoundException } from '@nestjs/common';
import { RepositoryException } from '../../exception/repository.exception';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createProduct(
    productData: CreateProductDTO,
    userId: number,
  ): Promise<Product> {
    const [restaurant, categories] = await Promise.all([
      this.restaurantService.findOne(productData.restaurant_id),
      this.categoryService.findAllByIds(productData.categories),
    ]);

    try {
      const result = await this.productRepository.create({
        categories,
        description: productData.description,
        inventory: productData.inventory,
        name: productData.name,
        price: productData.price,
        restaurant: restaurant,
        slug: slugify(productData.slug, {
          lower: true,
          strict: true,
          replacement: '-',
          trim: true,
        }),
        user_id: userId,
      });

      return result;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      return product;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const product = await this.productRepository.findBySlug(slug);
      return product;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllProduct(): Promise<Product[]> {
    return this.productRepository.getAll();
  }

  async updateProduct(
    id: number,
    updateData: UpdateProductDto,
  ): Promise<Product> {
    const updatedPayload = {};

    for (const key in updateData) {
      if (key === 'categories' && updateData[key]) {
        updatedPayload[key] = await this.categoryService.findAllByIds(
          updateData[key],
        );
      } else if (key === 'restaurant_id' && updateData[key]) {
        updatedPayload['restaurant'] = await this.restaurantService.findOne(
          updateData[key],
        );
      } else {
        updatedPayload[key] = updateData[key];
      }
    }
    try {
      const result = await this.productRepository.update(id, updatedPayload);
      return result;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const result = await this.productRepository.delete(id);
      return result;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async updateInventory(id: number, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);

    if (product.inventory < quantity) {
      throw new BadRequestException('Insufficient inventory');
    }

    try {
      const result = await this.productRepository.update(id, {
        inventory: product.inventory - quantity,
      });

      return result;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async toggleProductStatus(id: number): Promise<Product> {
    const product = await this.getProductById(id);

    try {
      const result = await this.productRepository.update(id, {
        is_active: !product.is_active,
      });

      return result;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
