import { EntityManager, wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Category } from '../../../models';
import { CategoryRepository } from './category.repository';
import { CategoryPersist } from './persistance/category.persist';
import { RepositoryException } from '../../../exception/repository.exception';

@Injectable()
export class MikroCategoryRepository implements CategoryRepository {
    constructor(private readonly em: EntityManager) {}

    async create(data: CategoryPersist): Promise<Category> {
        try {
            const category = this.em.create(Category, {
                name: data.name,
                isActivate: data.isActivate,
                en_name:data.en_name,
                slug:data.slug,
                user:data.userId,
            });
            await this.em.persistAndFlush(category);
            return category;
        } catch (err) {
            throw err;
        }
    }

    async findById(id: string): Promise<Category> {
        const category = await this.em.findOne(Category, { id: Number(id) });
        if (!category) {
            throw new RepositoryException(`Category with id ${id} not found`);
        }
        return category;
    }

    async findByName(name: string): Promise<Category> {
        const category = await this.em.findOne(Category, { name });
        if (!category) {
            throw new RepositoryException(`Category with name ${name} not found`);
        }
        return category;
    }

    async findAll(): Promise<Category[]> {
        return this.em.find(Category, {});
    }

    async update(id: string, data: Partial<Omit<CategoryPersist, 'userId'>>): Promise<Category> {
        const category = await this.findById(id);
        try {
            wrap(category).assign(data);
            await this.em.flush();
            return category;
        } catch (err) {
            throw err;
        }
    }

    async delete(id: string): Promise<Category> {
        const category = await this.findById(id);
        try {
            await this.em.removeAndFlush(category);
            return category;
        } catch (err) {
            throw err;
        }
    }

    async findActiveCategories(): Promise<Category[]> {
        return this.em.find(Category, { isActivate: true });
    }
}
