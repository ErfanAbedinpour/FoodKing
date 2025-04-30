import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateMenuDTO } from './DTO/create-menu.dto';
import { MenuService } from './menu.service';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBody({ type: CreateMenuDTO })
  @ApiCreatedResponse({
    description: 'Menu and subMenu Created',
    schema: { type: 'object', properties: { msg: { type: 'string' } } },
  })
  addMenu(@Body() createMenuDto: CreateMenuDTO) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  getMenus() {}

  @Get(':slug')
  getMenuBySlug() {}

  @Patch(':id')
  updateMenu() {}

  @Delete(':id')
  deleteMenu() {}
}
