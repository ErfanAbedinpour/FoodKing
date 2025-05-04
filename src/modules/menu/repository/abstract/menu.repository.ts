import { MenuModel } from '@models/menu.model';
import { MenuPersist } from './persist/menu.persist';

export abstract class MenuRepository {
  abstract create(menu: MenuPersist): Promise<void>;
  abstract findBySlug(
    slug: string,
    withSubs?: boolean,
  ): Promise<MenuModel | null>;
  abstract findById(id: number, withSubs?: boolean): Promise<MenuModel | null>;
  abstract findAll(withSubs?: boolean): Promise<MenuModel[]>;
  abstract update(
    id: number,
    data: Partial<Omit<MenuPersist, 'sub_menus'>>,
  ): Promise<MenuModel>;
  abstract delete(id: number): Promise<boolean>;
}
