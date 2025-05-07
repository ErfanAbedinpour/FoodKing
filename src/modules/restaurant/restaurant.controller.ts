import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { GetUser } from "../common/decorator/getUser.decorator";
import { RestaurantService } from "./restaurant.service";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Controller("restaurants")
export class RestaurantController {


    constructor(private readonly restaurantService:RestaurantService){}
    @Post()
    createRestaurant(@Body() createdRestaurant:CreateRestaurantDto, @GetUser('userId') userId:number) {
        return this.restaurantService.create(createdRestaurant,userId);
    }


    @Get()
    getAllRestaurant() { 
        return this.restaurantService.findAll();
    }

    @Get(":id")
    getRestaurantById(@Param("id",ParseIntPipe) restaurantId:number) {
        return this.restaurantService.findOne(restaurantId);
    }

    @Get("products")
    getAllRestaurantProducts() {
        return this.restaurantService.getAllRestaurantProducts();
    }

    @Get(":id/products")
    getRestaurantProduct(@Param("id",ParseIntPipe) restaurantId:number) {
        return this.restaurantService.getRestaurantProduct(restaurantId);
    }


    @Delete(":id")
    deleteRestaurant(@Param("id",ParseIntPipe) restaurantId:number) {
        return this.restaurantService.remove(restaurantId);
    }


    @Patch(":id")
    updateRestaurant(@Param("id",ParseIntPipe) restaurantId:number,@Body() updateRestaurantDto:UpdateRestaurantDto) {
        return this.restaurantService.update(restaurantId,updateRestaurantDto);
    }
}
