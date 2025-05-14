import { Restaurant } from "@models/restaurant.model";
import { RestaurantPersist } from "../persistance/restaurant-persist";
import { Loaded } from "@mikro-orm/core";

export abstract class RestaurantRepository{
    abstract create(restaurantData:RestaurantPersist):Promise<Restaurant>

    abstract findOne(id:number):Promise<Restaurant>

    abstract findAll():Promise<Restaurant[]>

    abstract getRestaurantProducts(id:number):Promise<Loaded<Restaurant, "products", "*", never>>

    abstract getAllRestaurantProducts():Promise<Restaurant[]>

    abstract update(id:number,data:Partial<Omit<RestaurantPersist,"owner_id">>):Promise<Restaurant>

    abstract delete(id:number):Promise<Restaurant>
}