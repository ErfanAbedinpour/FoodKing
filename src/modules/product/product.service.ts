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
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { StorageService } from '../storage/storage.service';
import { Directory } from '../storage/enum/directory.enum';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly restaurantService: RestaurantService,
    private readonly storage:StorageService
  ) {}

  private generateFileName(image: Express.Multer.File) {
    return `${Date.now()}-${image.originalname}`;
  }
  private async removeImage(fileName: string) {
    if(!fileName)
      return
    try{
      await this.storage.remove(fileName)
      return 
    }catch{
      return
    }
  }

  private async uploadImage(fileName: string, image: Express.Multer.File) {
    try{
      const result = await this.storage.upload(image.buffer,{key:fileName,mimetype:image.mimetype});
      return result;
    }catch(err){
      this.logger.error(`Error During Upload Product Image, ${err}`);
    }
  }

  async createProduct(
    productData: CreateProductDTO,
    userId: number,
    image: Express.Multer.File,
  ) {
    const [restaurant, categories] = await Promise.all([
      this.restaurantService.findOne(productData.restaurant_id),
      this.categoryService.findAllByIds(productData.categories),
    ]);

    try {
      console.log("resauraunt is ", restaurant)
      const imagePath = this.generateFileName(image);
      const fullPath = `${Directory.Products}/${imagePath}`;
      const result = await this.productRepository.create({
        categories,
        description: productData.description,
        inventory: productData.inventory,
        name: productData.name,
        price: productData.price,
        restaurant: restaurant,
        image:fullPath ,
        slug: slugify(productData.slug, {
          lower: true,
          strict: true,
          replacement: '-',
          trim: true,
        }),
        user_id: userId,
      });

      this.uploadImage(imagePath, image);
      return {
        id: result.id,
        categories,
        description: productData.description,
        inventory: productData.inventory,
        name: productData.name,
        price: productData.price,
        restaurant: restaurant,
        image: this.storage.signImageUrl(fullPath),
      };
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Slug is already exists');
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      product.image ? product.image = this.storage.signImageUrl(product.image):null
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
      product.image ? product.image = this.storage.signImageUrl(product.image):null
      return product;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllProduct(): Promise<Product[]> {
    const reuslt = await this.productRepository.getAll()
    return reuslt.map(product=>{
      product.image ? product.image = this.storage.signImageUrl(product.image):null
      return product;
    })
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
      } else{
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
      this.removeImage(result.image || '');
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
