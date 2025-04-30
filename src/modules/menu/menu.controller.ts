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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MenuDTO } from './DTO/menu.DTO';
import { ApiExtraModels } from '@nestjs/swagger';
import { SubMenuDTO } from './DTO/sub-menu.DTO';

@Controller('menu')
@ApiExtraModels(MenuDTO, SubMenuDTO)
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
  @ApiOkResponse({
    description: 'findAll Menus and Subs',
    schema: {
      type: 'array',
      items: {
        allOf: [
          { $ref: getSchemaPath(MenuDTO) },
          {
            type: 'object',
            properties: {
              subs_menus: {
                type: 'array',
                items: { $ref: getSchemaPath(SubMenuDTO) },
              },
            },
          },
        ],
      },
    },
  })
  getMenus() {
    return this.menuService.findAll();
  }

  @Get(':slug')
  @ApiOkResponse({
    description: 'menu and subs are find',
    schema: {
      allOf: [
        { $ref: getSchemaPath(MenuDTO) },
        {
          type: 'object',
          properties: {
            sub_menus: {
              type: 'array',
              items: { $ref: getSchemaPath(SubMenuDTO) },
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({ description: 'menu not found' })
  getMenuBySlug(@Param('slug') slug: string) {
    return this.menuService.findBySlug(slug);
  }

  @Patch(':id')
  updateMenu() { }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'menu not found' })
  @ApiOkResponse({
    description: 'menu removed',
    schema: { properties: { msg: { type: 'string' } } },
  })
  deleteMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }
}
