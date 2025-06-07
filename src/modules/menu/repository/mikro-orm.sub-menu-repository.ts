import { EntityManager, wrap } from "@mikro-orm/postgresql";
import { SubMenuRepository } from "./abstract/sub-menu.repository";
import { Injectable } from "@nestjs/common";
import { MenuModel, SubMenuModel } from "../../../models";
import { SubMenuPersis } from "./abstract/persist/sub-menu.persist";
import { RepositoryException } from "../../../exception/repository.exception";
import { ErrorMessage } from "../../../ErrorMessages/Error.enum";

@Injectable()
export class MikroSubMenuRepository implements SubMenuRepository {
    constructor(private readonly em: EntityManager) { }

    async create(menuId: number, subMenu: SubMenuPersis): Promise<SubMenuModel> {
        const isValidMenu = await this.em.findOne(MenuModel, menuId);

        if (!isValidMenu)
            throw new RepositoryException(ErrorMessage.MENU_NOT_FOUND)

        const sub = this.em.create(SubMenuModel, { en_title: subMenu.en_title, menu: menuId, slug: subMenu.slug, title: subMenu.title }, { persist: true });

        try {
            await this.em.flush();
            return sub
        } catch (err) {
            throw err
        }

    }


    async delete(menuId: number, id: number): Promise<boolean> {
        const subMenu = await this.em.findOne(SubMenuModel, { menu: menuId, id });
        if (!subMenu)
            return false
        try {
            await this.em.removeAndFlush(subMenu)
            return true;

        } catch (err) {
            throw err
        }
    }


    async update(menuId: number, id: number, data: Partial<SubMenuPersis>): Promise<SubMenuModel> {
        const subMenu = await this.em.findOne(SubMenuModel, { menu: menuId, id });
        if (!subMenu)
            throw new RepositoryException(ErrorMessage.SUB_MENU_NOT_FOUND)

        try {
            const result = wrap(subMenu).assign(data);
            await this.em.flush()
            return result

        } catch (err) {
            throw err;
        }
    }
}