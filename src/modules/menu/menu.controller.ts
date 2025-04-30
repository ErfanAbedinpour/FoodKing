import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMenuDTO } from './DTO/create-menu.dto';
import { MenuService } from './menu.service';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

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
  getMenus() {
    return this.menuService.findAll();
  }

  @Get(':slug')
  getMenuBySlug(@Param('slug') slug: string) {
    return this.menuService.findBySlug(slug);
  }

  @Patch(':id')
  updateMenu() { }

  @Delete(':id')
  deleteMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }
}
