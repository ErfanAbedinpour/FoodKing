import { MenuPersist } from './persist/menu.persist';
import { SubMenuPersis } from './persist/sub-menu.persist';
import { SubMenuModel } from '@models/sub-menu.model';

export abstract class SubMenuRepository {
    abstract create(menuId: number, subMenu: SubMenuPersis): Promise<SubMenuModel>;

    abstract update(
        menuId: number,
        id: number,
        data: Partial<SubMenuPersis>,
    ): Promise<SubMenuModel>;

    abstract delete(menuId: number, id: number): Promise<boolean>;
}

