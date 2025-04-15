import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";

@Entity({ tableName: "session" })
export class Session {
    @PrimaryKey()
    id!: number

    @Property()
    token: string

    @Property()
    tokenId: string

    @ManyToOne(() => User, { deleteRule: "cascade", updateRule: "cascade" })
    user: Rel<User>

    @Property({ columnType: 'bigint', type: 'bigint' })
    createdAt? = Date.now()

    @Property({ columnType: 'bigint', type: 'bigint' })
    exp: number
}