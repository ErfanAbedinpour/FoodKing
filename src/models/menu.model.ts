import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseModel } from "./base.model";
import { SubMenuModel } from "./sub-menu.model";

@Entity({ tableName: "menu" })
export class MenuModel extends BaseModel {

    @Property({ nullable: false })
    title: string

    @Property({ unique: true })
    slug: string

    @Property({ nullable: false })
    en_title: string

    @OneToMany(() => SubMenuModel, sub => sub.menu)
    subs_menus = new Collection<SubMenuModel>(this)
}
