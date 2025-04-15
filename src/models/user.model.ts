import { BeforeCreate, Collection, Entity, EventArgs, OneToMany, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { Role } from "./role.model";
import { Address } from "./address.model";
import { Session } from "./user-session";
import { Comment } from "./comment.model";
import { Cart } from "./cart.model";
import { Order } from "./order.model";
import { Product } from "./product.model";
import { ArgonHash } from "../modules/auth/infrastructure/hash/argon-hash";


@Entity({ tableName: "User" })
export class User extends BaseModel {
    private hashService = new ArgonHash()

    @Property({ nullable: false })
    name: string

    @Property({ unique: true, nullable: false })
    email: string

    @Property({ hidden: true, lazy: true, nullable: false })
    password: string

    @OneToOne({ entity: () => Role, nullable: false, fieldName: "role_id", owner: true, deleteRule: "set default" })
    role: Rel<Role>

    @Property({ nullable: false, unique: true })
    phone_number: string

    @Property({})
    is_active: boolean

    @OneToMany(() => Product, (product) => product.user)
    products = new Collection<Product>(this)

    @OneToMany(() => Address, address => address.user)
    addresses = new Collection<Address>(this)


    @OneToMany(() => Session, s => s.user)
    sessions = new Collection<Session>(this)

    @OneToMany(() => Order, order => order.user)
    orders = new Collection<Order>(this)

    @OneToMany(() => Comment, comment => comment.user)
    comments = new Collection<Comment>(this)

    @OneToOne(() => Cart, cart => cart.user)
    cart: Rel<Cart>

    @BeforeCreate()
    async beforeCreate(args: EventArgs<this>) {
        args.entity.password = await this.hashService.hash(args.entity.password)
        args.entity.email = args.entity.email.toLowerCase();
        return args;
    }
}