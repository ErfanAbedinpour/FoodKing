import { Module } from "@nestjs/common";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { MenuRepository } from "./repository/abstract/menu.repository";
import { MikroMenuRepository } from "./repository/mikro-orm-menu-repository";

@Module({
    controllers: [MenuController],
    providers: [
        MenuService,
        {
            provide: MenuRepository,
            useClass: MikroMenuRepository
        }
    ],
    exports: [MenuService]
})
export class MenuModule { }