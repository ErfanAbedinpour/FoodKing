import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantRepository } from './respository/abstract/restaurant.repository';
import { Restaurant } from '../../models';
import { RepositoryException } from '../../exception/repository.exception';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository:  RestaurantRepository
  ) {}

  private readonly logger = new Logger(RestaurantService.name);

  async create(createRestaurantDto: CreateRestaurantDto,userId:number):Promise<Restaurant>{
    try{
        const results = await this.restaurantRepository.create({...createRestaurantDto,owner_id:userId});
        return results
    }catch(err){
        this.logger.error(err);
        throw new InternalServerErrorException()
    }
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.findAll();
  }

  async findOne(id: number): Promise<Restaurant> {
    try{
        const restaurant = await this.restaurantRepository.findOne(id);
        return restaurant;
    }catch(err){
        if(err instanceof RepositoryException)
            throw new NotFoundException(err.message)
        this.logger.error(err)
        throw new InternalServerErrorException()
    }
  }
  

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    try{
        const restaurant = await this.restaurantRepository.update(id,updateRestaurantDto)
        return restaurant
    }catch(err){
        if(err instanceof RepositoryException)
            throw new NotFoundException(err.message)
        this.logger.error(err)
        throw new InternalServerErrorException()
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.restaurantRepository.delete(id);
    } catch (err) {
      if (err instanceof RepositoryException) 
        throw new NotFoundException(err.message)

      this.logger.error(err);
      throw new InternalServerErrorException('Failed to delete restaurant');
    }
  }

  async getAllRestaurantProducts(): Promise<Restaurant[]> {
    try {
      return this.restaurantRepository.getAllRestaurantProducts();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Failed to fetch restaurant products');
    }
  }

  async getRestaurantProducts(restaurantId: number): Promise<Restaurant> {
    try {
      const restaurant = await this.restaurantRepository.getRestaurantProducts(restaurantId);
      return restaurant;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Failed to fetch restaurant products');
    }
  }
}
