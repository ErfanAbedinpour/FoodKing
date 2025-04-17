import { Collection, Entity,  OneToMany, Property } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { ProductAttribute } from "./product-attribute.model";



@Entity({ tableName: "attribute" })
export class Attribute extends BaseModel{
    @Property({ unique: true })
    name!: string

    @OneToMany(() => ProductAttribute, product => product.attribute,)
    products = new Collection<ProductAttribute>(this)
}