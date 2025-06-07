import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { GetUser } from "../common/decorator/getUser.decorator";
import { RestaurantService } from "./restaurant.service";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { IsAuth } from "../common/decorator/auth.decorator";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RestaurantDTO } from "./dto/restaurant.dto";
import { CreateRestaurantSwagger, DeleteRestaurantSwagger, GetAllRestaurantProductsSwagger, GetAllRestaurantsSwagger, GetRestaurantByIdSwagger, GetRestaurantProductByIdSwagger,  UpdateRestaurantSwagger } from "./restaurant.swagger";

@Controller("restaurants")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Post()
    @CreateRestaurantSwagger()
    createRestaurant(@Body() createdRestaurant: CreateRestaurantDto, @GetUser('userId') userId: number) {
        return this.restaurantService.create(createdRestaurant, userId);
    }


    @Get()
    @GetAllRestaurantsSwagger()
    getAllRestaurant() {
        return this.restaurantService.findAll();
    }

    @Get(":id")
    @GetRestaurantByIdSwagger()
    getRestaurantById(@Param("id", ParseIntPipe) restaurantId: number) {
        return this.restaurantService.findOne(restaurantId);
    }

    @Get("products")
    @GetAllRestaurantProductsSwagger()
    getAllRestaurantProducts() {
         return this.restaurantService.getAllRestaurantProducts();
    }

    @Get(":id/products")
    @GetRestaurantProductByIdSwagger()
    getRestaurantProductById(@Param("id", ParseIntPipe) restaurantId: number) {
        return this.restaurantService.getRestaurantProducts(restaurantId);
    }


    @Delete(":id")
    @IsAuth()
    @DeleteRestaurantSwagger()
    deleteRestaurant(@Param("id", ParseIntPipe) restaurantId: number) {
        return this.restaurantService.remove(restaurantId);
    }


    @Patch(":id")
    @IsAuth()
    @UpdateRestaurantSwagger() 
    updateRestaurant(@Param("id", ParseIntPipe) restaurantId: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
        return this.restaurantService.update(restaurantId, updateRestaurantDto);
    }
}
