import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { IsAuth } from "../common/decorator/auth.decorator";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { RestaurantDTO } from "./dto/restaurant.dto";

export function CreateRestaurantSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiCreatedResponse({ description: "Restaurant Created", type: RestaurantDTO }),
        ApiBody({ type: CreateRestaurantDto }),
        ApiOperation({ summary: "Create Restaurant" }),
    )
}


export function GetRestaurantByIdSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiParam({name:"id",type:Number,description:"Restaurant Id",example:1}),
        ApiOkResponse({ description: "Restaurant Found", type: RestaurantDTO }),
        ApiNotFoundResponse({ description: "Restaurant Not Found" }),
        ApiOperation({ summary: "Get Restaurant By Id" }),
    )
}


export function GetAllRestaurantsSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiOkResponse({ description: "Restaurants Found", type: [RestaurantDTO] }),
        ApiOperation({ summary: "Get All Restaurants" }),
    )
}


export function GetRestaurantProductByIdSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiOkResponse({ description: "Restaurant Product Found", type: RestaurantDTO }),
        ApiNotFoundResponse({ description: "Restaurant Not Found" }),
        ApiOperation({ summary: "Get Restaurant Product" }),
    )
}

export function GetAllRestaurantProductsSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiOkResponse({ description: "Restaurant Products Found", type: [RestaurantDTO] }),
        ApiOperation({ summary: "Get All Restaurant Products" }),
    )
}


export function DeleteRestaurantSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiOkResponse({ description: "Restaurant Deleted" }),
        ApiNotFoundResponse({ description: "Restaurant Not Found" }),
        ApiOperation({ summary: "Delete Restaurant" }),
    )
}

export function UpdateRestaurantSwagger(){
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiOkResponse({ description: "Restaurant Updated" }),
        ApiNotFoundResponse({ description: "Restaurant Not Found" }),
        ApiOperation({ summary: "Update Restaurant" }),
    )
}