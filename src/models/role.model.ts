import { Entity, Enum } from "@mikro-orm/core";
import { BaseModel } from "./base.model";

export enum UserRole {
    Customer = "Customer",
    Manager = "Manager",
    Delivery = "Delivery",
    RestaurantOwner = "Owner"
}

@Entity({ tableName: "Role" })
export class Role extends BaseModel {
    @Enum({ items: () => Role, unique: true, default: UserRole.Customer })
    name: UserRole

}