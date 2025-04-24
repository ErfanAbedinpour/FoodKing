import { SubMenuPersis } from "./sub-menu.persist";

export class MenuPersist {
    public slug: string
    public title: string
    public en_title: string
    public sub_menus: SubMenuPersis[] = []
}