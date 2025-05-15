import { EntityManager, Loaded, wrap } from '@mikro-orm/core';
import { Restaurant } from '@models/restaurant.model';
import { RestaurantPersist } from './persistance/restaurant-persist';
import { RestaurantRepository } from './abstract/restaurant.repository';
import { User } from '@models/user.model';
import { RepositoryException } from '../../../exception/repository.exception';
import { Injectable } from '@nestjs/common';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';

@Injectable()
export class MikroRestaurantRepository implements RestaurantRepository {
    constructor(private readonly em: EntityManager) { }

    async create(restaurantData: RestaurantPersist): Promise<Restaurant> {
        const owner = this.em.getReference(User, restaurantData.owner_id);

        const newRestaurant = this.em.create(Restaurant, {
            name: restaurantData.name,
            en_name: restaurantData.en_name,
            ownerId: owner
        }, { persist: true });

        try {
            await this.em.flush();
            return newRestaurant;
        } catch (err) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_CREATE_FAILED);
        }
    }

    async findOne(id: number): Promise<Restaurant> {
        const restaurant = await this.em.findOne(Restaurant, id);

        if (!restaurant) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_NOT_FOUND);
        }

        return restaurant;
    }

    async findAll(): Promise<Restaurant[]> {
        try {
            const restaurants = await this.em.findAll(Restaurant,{});

            return restaurants; 
        } catch (err) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_FETCH_FAILED);
        }
    }

    async getRestaurantProducts(id: number): Promise<Loaded<Restaurant, 'products', '*', never>> {
        try {
            const restaurant = await this.em.findOneOrFail(Restaurant,{id},{populate:['products']});
            return restaurant
        } catch (err) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_PRODUCTS_FETCH_FAILED);
        }
    }

    async getAllRestaurantProducts(): Promise<Restaurant[]> {
        try {
            return await this.em.find(Restaurant, {}, {
                populate: ['products']
            });
        } catch (err) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_PRODUCTS_FETCH_FAILED);
        }
    }

    async update(id: number, data: Partial<Omit<RestaurantPersist, "owner_id">>): Promise<Restaurant> {
        const restaurant = await this.findOne(id);

        try {
            const updatedRestaurant = wrap(restaurant).assign(data);
            await this.em.flush();
            return updatedRestaurant;
        } catch (err) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_UPDATE_FAILED);
        }
    }

    async delete(id: number): Promise<Restaurant> {
        const restaurant = await this.findOne(id);

        try {
            await this.em.removeAndFlush(restaurant);
            return restaurant;
        } catch (err) {
            throw new RepositoryException(ErrorMessage.RESTAURANT_DELETE_FAILED);
        }
    }
}