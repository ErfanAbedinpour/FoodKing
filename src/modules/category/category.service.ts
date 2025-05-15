import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './repository/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { Category } from '../../models';
import { RepositoryException } from '../../exception/repository.exception';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name)
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async create(createCategoryDto: CreateCategoryDto,userId:number): Promise<Category> {
        try{
        const result = await this.categoryRepository.create({
            name: createCategoryDto.name,
            isActivate: createCategoryDto.isActivate,
            en_name: createCategoryDto.en_name,
            slug: slugify(createCategoryDto.slug,{trim:true,replacement:'-',lower:true}),
            userId: userId,
         });

         return result;

        }catch(err){
            if(err instanceof UniqueConstraintViolationException)
                throw new BadRequestException(ErrorMessage.CATEGORY_SLUG_IS_INVALID)
            this.logger.error(err)
            throw new InternalServerErrorException(`Failed to create category`);
        }
   }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.findAll();
    }

    async findOne(id: string): Promise<Category> {
        try {
            const result = await this.categoryRepository.findById(id);
            return result
        } catch (error) {
            if(error instanceof RepositoryException)
                throw new NotFoundException(error.message);

            this.logger.error(error)
            throw new InternalServerErrorException(`Failed to find category with id ${id}`);
        }
    }

    async findByName(name: string): Promise<Category> {
       try {
            const result = await this.categoryRepository.findByName(name);
            return result
        } catch (error) {
            if(error instanceof RepositoryException)
                throw new NotFoundException(error.message);
            this.logger.error(error)
            throw new InternalServerErrorException(`Category with name ${name} not found`);
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        try {

            if(updateCategoryDto.slug)
                Object.assign(updateCategoryDto,{slug:slugify(updateCategoryDto.slug,{trim:true,replacement:'-',lower:true})})

            const result = await  this.categoryRepository.update(id, updateCategoryDto);
            return result
        } catch (error) {

            if(error instanceof RepositoryException)
                throw new NotFoundException(error.message);

            if(error instanceof UniqueConstraintViolationException)
                throw new BadRequestException(ErrorMessage.CATEGORY_SLUG_IS_INVALID)

            this.logger.error(error)
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    async remove(id: string) {
        try {
            await this.categoryRepository.delete(id);
            return {msg:"Removed successfully"}
        } catch (error) {
            if(error instanceof RepositoryException)
                throw new NotFoundException(error.message);
            this.logger.error(error)
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    async findActiveCategories(): Promise<Category[]> {
        return this.categoryRepository.findActiveCategories();
    }
}
