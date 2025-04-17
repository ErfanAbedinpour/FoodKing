import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { User } from "./user.model";

@Entity({tableName:"Address"})
export class Address extends BaseModel{
    @Property()
    postal_code!: string

    @Property({ type: 'text' })
    street!: string
    
    @Property({})
    province:string

    @Property()
    latitude:number

    @Property()
    longitude:number

    @ManyToOne(() => User)
    user: Rel<User>
}