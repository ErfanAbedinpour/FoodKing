import { CategoryPersist } from './persistance/category.persist';
import { Category } from '../../../models';


export abstract class CategoryRepository {
    abstract create(data: Partial<CategoryPersist>): Promise<Category>;
    abstract findById(id: string): Promise<Category>;
    abstract findByName(name: string): Promise<Category>;
    abstract findAll(): Promise<Category[]>;
    abstract update(id: string, data: Partial<Omit<CategoryPersist,'userId'>>): Promise<Category>;
    abstract delete(id: string): Promise<Category>;
    abstract findActiveCategories(): Promise<Category[]>;
    abstract findIds(ids:number[]):Promise<Category[]>
} 