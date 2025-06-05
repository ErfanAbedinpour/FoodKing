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
import { ApiForbiddenResponse } from '@nestjs/swagger';
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
import { AddSubMenuSwagger, CreateMenuSwagger, DeleteMenuSwagger, DeleteSubMenuSwagger, GetMenuBySlugSwagger, GetMenusSwagger, UpdateMenuSwagger, UpdateSubMenuSwagger } from './menu.swagger';

@Controller('menu')
@ApiExtraModels(MenuDTO, SubMenuDTO)
@ApiForbiddenResponse({ description: ErrorMessage.INVALID_ACCESS })
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly subMenuService: SubMenuService
  ) { }

  @Post()
  @IsAuth()
  @RoleAccess(UserRole.Owner)
  @CreateMenuSwagger()
  addMenu(@Body() createMenuDto: CreateMenuDTO) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @GetMenusSwagger()
  getMenus() {
    return this.menuService.findAll();
  }

  @Get(':slug')
  @GetMenuBySlugSwagger()
  getMenuBySlug(@Param('slug') slug: string) {
    return this.menuService.findBySlug(slug);
  }

  @Patch(':id')
  @IsAuth()
  @RoleAccess(UserRole.Owner)
  @UpdateMenuSwagger()
  updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMenuDTO,
  ) {
    return this.menuService.updateMenu(id, updateDto);
  }

  @Delete(':id')
  @IsAuth()
  @RoleAccess(UserRole.Owner)
  @DeleteMenuSwagger()
  deleteMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }

  // subMenu
  @Post(":menuId/sub-menu")
  @IsAuth()
  @RoleAccess(UserRole.Owner)
  @AddSubMenuSwagger()
  addSubMenu(@Param("menuId", ParseIntPipe) menuId: number, @Body() createSubMenuDto: CreateSubMenuDTO) {
    return this.subMenuService.create(menuId, createSubMenuDto)
  }


  @Delete(":subMenuId/sub-menu")
  @IsAuth()
  @RoleAccess(UserRole.Owner)
  @DeleteSubMenuSwagger()
  deleteSubMenu(@Param("subMenuId", ParseIntPipe) subMenuId: number) {
    return this.subMenuService.delete(subMenuId)
  }


  @Patch(":subMenuId/sub-menu")
  @IsAuth()
  @RoleAccess(UserRole.Owner)
  @UpdateSubMenuSwagger()
  updateSubMenu(@Param("subMenuId", ParseIntPipe) subMenuId: number, @Body() updateSubMenu: UpdateSubMenuDTO) {
    return this.subMenuService.update(subMenuId, updateSubMenu)
  }
}
