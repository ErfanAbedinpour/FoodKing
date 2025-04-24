import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { CreateMenuDTO } from "./DTO/create-menu.dto";

@Controller("menu")
export class MenuController {
    constructor() { }

    @Post()
    addMenu(@Body() createMenuDto: CreateMenuDTO) { }

    @Get()
    getMenus() { }


    @Get(":slug")
    getMenuBySlug() { }


    @Patch(":id")
    updateMenu() { }


    @Delete(":id")
    deleteMenu() { }
}