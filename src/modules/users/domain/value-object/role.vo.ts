import { UserRole } from "../../../../models";

export class Role {

    static Delivery = new Role(UserRole.Delivery)
    static Customer = new Role(UserRole.Customer)
    static ResOwner = new Role(UserRole.RestaurantOwner)
    static Manager = new Role(UserRole.Manager)

    constructor(public value: UserRole) { }

}