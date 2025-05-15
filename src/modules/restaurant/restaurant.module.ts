import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MikroRestaurantRepository } from './respository/mikro-restaurant.repository';
import { RestaurantRepository } from './respository/abstract/restaurant.repository';

@Module({
    controllers:[RestaurantController], 
    providers:[
        RestaurantService,
        {
            provide:RestaurantRepository,
            useClass:MikroRestaurantRepository
        }
    ],
    exports:[RestaurantService]
})
export class RestaurantModule{}