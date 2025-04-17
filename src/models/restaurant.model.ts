import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { Product } from ".";

@Entity({ tableName: "Restaurant" })
export class Restaurant extends BaseModel {

    @Property({ nullable: false })
    name: string

    @Property({ nullable: false })
    en_name: string

    @OneToMany(() => Product, p => p.restaurant)
    products = new Collection<Product>(this)
}