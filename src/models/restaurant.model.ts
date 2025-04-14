import { Collection, OneToMany, Property } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { Product } from "./product.model";

export class Restaurant extends BaseModel{

    @Property({nullable:false})
    name:string

    @Property({nullable:false})
    en_name:string


    @OneToMany(()=>Product,p=>p.restaurant)
    products = new Collection<Product>(this)
}