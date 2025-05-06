import {  EntityManager, wrap } from '@mikro-orm/core';
import { Product } from '@models/product.model';
import { ProductPersist } from './persistance/product';
import { ProductRepository } from './product.repository';
import { User } from '@models/user.model';
import { Restaurant } from '@models/restaurant.model';
import { Injectable } from '@nestjs/common';
import { ProductCategory } from '@models/product-category.model';
import { RepositoryException } from 'src/exception/repository.exception';

@Injectable()
export class MikroProductRepository implements ProductRepository {

    constructor(private readonly em: EntityManager) { }

    async create(product: ProductPersist): Promise<Product> {

        const user = this.em.getReference(User, product.user_id);
        const restaurant = this.em.getReference(Restaurant, product.restaurant_id);
        
        const newProduct = this.em.create(Product,{
            name: product.name,
            description: product.description,
            slug: product.slug,
            inventory: product.inventory,
            price: product.price,
            user,
            restaurant,
            is_active: true,
        },{persist:true});

        product.category_ids.forEach((category)=> this.em.create(ProductCategory,{category,product:newProduct},{persist:true}));

        try{
            await this.em.flush();
            return newProduct;

        }catch(err){
            throw err
        }
    }

    async findById(id: number): Promise<Product> {
        const product = await this.em.findOne(Product,{ id });
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        return product;
    }

    async findBySlug(slug: string): Promise<Product> {
        const product = await this.em.findOne(Product ,{ slug });
        if (!product) {
            throw new RepositoryException(`Product with slug ${slug} not found`);
        }
        return product;
    }

    async delete(id: number): Promise<Product> {
        const product = await this.findById(id);
        await this.em.removeAndFlush(product);
        return product;
    }

    async update(id: number, data: Partial<Omit<ProductPersist, 'user_id'>>): Promise<Product> {
        const product = await this.findById(id);
        const updatedProduct= wrap(product).assign(data);
        await this.em.flush();
        return updatedProduct ;
    }
}
