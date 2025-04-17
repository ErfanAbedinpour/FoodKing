import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { BaseModel } from "./base.model";

@Entity({ tableName: "categoryies" })
export class Category extends BaseModel{
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

}