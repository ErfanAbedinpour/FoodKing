import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { Product } from '@models/product.model';
import { NotFoundException } from '@nestjs/common';
import { RepositoryException } from '../../exception/repository.exception';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name)

  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(productData: CreateProductDTO,userId:number): Promise<Product> {
    return this.productRepository.create({
        category_ids:productData.categories,
        description:productData.description,
        inventory:productData.inventory,
        name:productData.name,
        price:productData.price,
        restaurant_id:productData.restaurant_id,
        slug:productData.slug,
        user_id:userId 
    });
  }

  async getProductById(id: number): Promise<Product> {
    try{
        const product = await this.productRepository.findById(id);
        return product;
    }catch(err){
        if(err instanceof RepositoryException)
            throw new NotFoundException(err.message)

        this.logger.error(err)
        throw new InternalServerErrorException()
    }
  }

  async getProductBySlug(slug: string): Promise<Product> {
    try{
    const product = await this.productRepository.findBySlug(slug);
    return product;

    }catch(err){
        if(err instanceof RepositoryException)
            throw new NotFoundException(err.message)

        this.logger.error(err)
        throw new InternalServerErrorException()
    }
  }

  async updateProduct(
    id: number,
    updateData:UpdateProductDto 
  ): Promise<Product> {
     await this.getProductById(id);
    return this.productRepository.update(id, updateData);
  }

  async deleteProduct(id: number): Promise<Product> {
     await this.getProductById(id);
    return this.productRepository.delete(id);
  }

  async updateInventory(id: number, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    if (product.inventory < quantity) {
      throw new Error('Insufficient inventory');
    }
    return this.productRepository.update(id, {
      inventory: product.inventory - quantity,
    });
  }

async toggleProductStatus(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    return this.productRepository.update(id, {
      is_active: !product.is_active,
    });
  }
}
