import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { MenuModel } from "./menu.model";

@Entity({ tableName: "sub-menu" })
export class SubMenuModel extends BaseModel {

    @Property({ nullable: false })
    title: string

    @Property({ unique: true })
    slug: string

    @Property({ nullable: false })
    en_title: string

    @ManyToOne(() => MenuModel, { deleteRule: 'cascade', updateRule: "cascade" })
    menu: MenuModel
}
