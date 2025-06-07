import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './repository/abstract/menu.repository';
import { MikroMenuRepository } from './repository/mikro-orm-menu-repository';
import { SubMenuRepository } from './repository/abstract/sub-menu.repository';
import { MikroSubMenuRepository } from './repository/mikro-orm.sub-menu-repository';
import { SubMenuService } from './sub-menu/sub-menu.service';
import { SubMenuController } from './sub-menu/sub-menu.controller';

@Module({
  controllers: [MenuController, SubMenuController],
  providers: [
    MenuService,
    SubMenuService,
    {
      provide: MenuRepository,
      useClass: MikroMenuRepository,
    },
    {
      provide: SubMenuRepository,
      useClass: MikroSubMenuRepository
    }
  ],
  exports: [MenuService],
})
export class MenuModule { }
