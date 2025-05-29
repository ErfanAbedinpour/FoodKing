import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { GetUser } from "../common/decorator/getUser.decorator";
import { RestaurantService } from "./restaurant.service";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { IsAuth } from "../common/decorator/auth.decorator";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RestaurantDTO } from "./dto/restaurant.dto";

@Controller("restaurants")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Post()
    @ApiBearerAuth("JWT-AUTH")
    @IsAuth()

    @ApiCreatedResponse({ description: "Restaurant Created", type: RestaurantDTO })
    @ApiBody({ type: CreateRestaurantDto })
    @ApiOperation({ summary: "Create Restaurant" })
    createRestaurant(@Body() createdRestaurant: CreateRestaurantDto, @GetUser('userId') userId: number) {
        return this.restaurantService.create(createdRestaurant, userId);
    }


    @Get()
    @ApiOkResponse({ description: "Get All Restaurants", type: [RestaurantDTO] })
    @ApiOperation({ summary: "Get All Restaurants" })
    getAllRestaurant() {
        return this.restaurantService.findAll();
    }

    @Get(":id")
    @ApiOkResponse({ description: "Get Restaurant By Id", type: RestaurantDTO })
    @ApiNotFoundResponse({ description: "Restaurant Not Found" })
    @ApiOperation({ summary: "Get Restaurant By Id" })
    getRestaurantById(@Param("id", ParseIntPipe) restaurantId: number) {
        return this.restaurantService.findOne(restaurantId);
    }

    @Get("products")
    @ApiOkResponse({ description: "Get All Restaurant Products", type: [RestaurantDTO] })
    @ApiOperation({ summary: "Get All Restaurant Products" })
    @ApiNotFoundResponse({ description: "Restaurant Not Found" })
    getAllRestaurantProducts() {
        return this.restaurantService.getAllRestaurantProducts();
    }

    @Get(":id/products")
    @ApiOkResponse({ description: "Get Restaurant Products By Id", type: RestaurantDTO })
    @ApiNotFoundResponse({ description: "Restaurant Not Found" })
    @ApiOperation({ summary: "Get Restaurant Products By Id" })
    getRestaurantProduct(@Param("id", ParseIntPipe) restaurantId: number) {
        return this.restaurantService.getRestaurantProduct(restaurantId);
    }


    @Delete(":id")
    @ApiBearerAuth("JWT-AUTH")
    @IsAuth()

    @ApiOkResponse({ description: "Restaurant Deleted" })
    @ApiNotFoundResponse({ description: "Restaurant Not Found" })
    @ApiOperation({ summary: "Delete Restaurant" })
    deleteRestaurant(@Param("id", ParseIntPipe) restaurantId: number) {
        return this.restaurantService.remove(restaurantId);
    }


    @Patch(":id")
    @ApiBearerAuth("JWT-AUTH")
    @IsAuth()
    @ApiOkResponse({ description: "Restaurant Updated", type: RestaurantDTO })
    @ApiNotFoundResponse({ description: "Restaurant Not Found" })
    @ApiOperation({ summary: "Update Restaurant" })
    updateRestaurant(@Param("id", ParseIntPipe) restaurantId: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
        return this.restaurantService.update(restaurantId, updateRestaurantDto);
    }
}
