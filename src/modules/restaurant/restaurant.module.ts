import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantRepository } from './respository/abstract/restaurant.repository';
import { MikroRestaurantRepository } from './mikro-restaurant.repository';

@Module({
    controllers:[RestaurantController], 
    providers:[
        RestaurantService,
        {
            provide:RestaurantRepository,
            useClass:MikroRestaurantRepository
        }
    ]
})
export class RestaurantModule{}