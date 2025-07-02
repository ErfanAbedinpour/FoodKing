import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { MenuRepository } from './abstract/menu.repository';
import { Injectable } from '@nestjs/common';
import { MenuModel, SubMenuModel } from '../../../models';
import { MenuPersist } from './abstract/persist/menu.persist';
import { RepositoryException } from '../../common/exception/repository.exception';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';

@Injectable()
export class MikroMenuRepository implements MenuRepository {
  constructor(private readonly em: EntityManager) { }

  async create(menu: MenuPersist): Promise<void> {
    const persisMenu = this.em.create(
      MenuModel,
      { slug: menu.slug, en_title: menu.en_title, title: menu.title },
      { persist: true },
    );

    for (const sub of menu.sub_menus) {
      persisMenu.subs_menus.add(
        this.em.create(SubMenuModel, {
          en_title: sub.en_title,
          slug: sub.slug,
          menu: persisMenu,
          title: sub.title,
        }),
      );
    }

    try {
      await this.em.flush();
    } catch (err) {
      throw err;
    }
  }

  findAll(withSubs?: boolean): Promise<MenuModel[]> {
    return this.em.findAll(
      MenuModel,
      withSubs ? { populate: ['subs_menus'] } : {},
    );
  }

  findBySlug(slug: string, withSubs?: boolean): Promise<MenuModel | null> {
    return this.em.findOne(
      MenuModel,
      { slug },
      withSubs ? { populate: ['subs_menus'] } : {},
    );
  }

  findById(id: number, withSubs?: boolean): Promise<MenuModel | null> {
    return this.em.findOne(
      MenuModel,
      id,
      withSubs ? { populate: ['subs_menus'] } : {},
    );
  }

  async delete(id: number): Promise<boolean> {
    const menu = await this.findById(id);
    if (!menu) return false;

    try {
      await this.em.removeAndFlush(menu);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async update(
    id: number,
    data: Partial<Omit<MenuPersist, 'sub_menus'>>,
  ): Promise<MenuModel> {
    const menu = await this.findById(id);

    if (!menu) throw new RepositoryException(ErrorMessage.MENU_NOT_FOUND);

    const res = wrap(menu).assign(data);

    try {
      await this.em.flush();
      return res;
    } catch (err) {
      throw err;
    }
  }
}
