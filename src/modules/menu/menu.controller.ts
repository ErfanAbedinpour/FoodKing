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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { MenuDTO } from './DTO/menu.DTO';
import { ApiExtraModels } from '@nestjs/swagger';
import { SubMenuDTO } from './DTO/sub-menu.DTO';
import { UpdateMenuDTO } from './DTO/update-menu.dto';
import { CreateSubMenuDTO } from './DTO/create-sub-menu.dto';
import { SubMenuService } from './sub-menu/sub-menu.service';
import { UpdateSubMenuDTO } from './DTO/update-sub-menu.dto';
import { IsAuth } from '../common/decorator/auth.decorator';
import { RoleAccess } from '../common/decorator/role-access.decorator';
import { UserRole } from '../../models';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';

@Controller('menu')
@IsAuth()
@RoleAccess(UserRole.Owner)
@ApiBearerAuth("JWT-AUTH")
@ApiExtraModels(MenuDTO, SubMenuDTO)
@ApiForbiddenResponse({ description: ErrorMessage.INVALID_ACCESS })
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly subMenuService: SubMenuService
  ) { }

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
  @ApiOkResponse({ type: MenuDTO })
  @ApiNotFoundResponse({})
  updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMenuDTO,
  ) {
    return this.menuService.updateMenu(id, updateDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'menu not found' })
  @ApiOkResponse({
    description: 'menu removed',
    schema: { properties: { msg: { type: 'string' } } },
  })
  deleteMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }

  // subMenu
  @Post(":menuId/sub-menu")
  @ApiParam({ name: "menuId", description: "menu Id" })
  @ApiCreatedResponse({ type: SubMenuDTO })
  @ApiBadRequestResponse({ description: "menuId is invalid." })
  addSubMenu(@Param("menuId", ParseIntPipe) menuId: number, @Body() createSubMenuDto: CreateSubMenuDTO) {
    return this.subMenuService.create(menuId, createSubMenuDto)
  }


  @Delete(":subMenuId/sub-menu")
  @ApiParam({ name: "subMenuId", description: "subMenuId" })
  @ApiOkResponse({ description: "submenu Removed successfully", schema: { properties: { msg: { type: 'string' } } } })
  @ApiNotFoundResponse({ description: "sub Menu not found" })
  deleteSubMenu(@Param("subMenuId", ParseIntPipe) subMenuId: number) {
    return this.subMenuService.delete(subMenuId)
  }


  @Patch(":subMenuId/sub-menu")
  @ApiParam({ name: "subMenuId", description: "subMenuId" })
  @ApiOkResponse({ description: "sub Menu updated", type: SubMenuDTO })
  @ApiNotFoundResponse({ description: "sub Menu not found" })
  @ApiBody({ type: UpdateSubMenuDTO })
  updateSubMenu(@Param("subMenuId", ParseIntPipe) subMenuId: number, @Body() updateSubMenu: UpdateSubMenuDTO) {
    return this.subMenuService.update(subMenuId, updateSubMenu)
  }
}
