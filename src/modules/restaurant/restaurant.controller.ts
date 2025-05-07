import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("restaurants")
export class RestaurantController {


    @Post()
    createRestaurant() { }


    @Get()
    getAllRestaurant() { }


    @Get(":id")
    getRestaurantById() { }


    @Get("products")
    getAllRestaurantProducts() { }

    @Get(":id/products")
    getRestaurantProduct() { }


    @Delete(":id")
    deleteRestaurant() { }


    @Patch(":id")
    updateRestaurant() { }
}
