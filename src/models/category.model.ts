import { Collection, Entity, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { BaseModel } from "./base.model";
import { ProductCategory } from "./product-category.model";

@Entity({ tableName: "categories" })
export class Category extends BaseModel {
    @Property({ unique: true, length: 50 })
    slug: string

    @Property()
    name: string

    @Property()
    en_name: string

    @Property({ default: true })
    isActivate: boolean

    @ManyToOne(() => User, { fieldName: "user_id" })
    user: Rel<User>

    @OneToMany(() => ProductCategory, cp => cp.category)
    products = new Collection<ProductCategory>(this)

}