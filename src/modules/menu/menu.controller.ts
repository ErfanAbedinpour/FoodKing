import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { CreateMenuDTO } from "./DTO/create-menu.dto";
import { MenuService } from "./menu.service";
import { ApiBody } from "@nestjs/swagger";

@Controller("menu")
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Post()
    @ApiBody({ type: CreateMenuDTO })
    addMenu(@Body() createMenuDto: CreateMenuDTO) {
        return this.menuService.create(createMenuDto);
    }

    @Get()
    getMenus() { }


    @Get(":slug")
    getMenuBySlug() { }


    @Patch(":id")
    updateMenu() { }


    @Delete(":id")
    deleteMenu() { }
}