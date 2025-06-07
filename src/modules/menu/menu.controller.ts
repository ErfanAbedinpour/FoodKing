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
import { IsAuth } from '../common/decorator/auth.decorator';
import { RoleAccess } from '../common/decorator/role-access.decorator';
import { UserRole } from '../../models';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';
import { CreateMenuSwagger, DeleteMenuSwagger, GetMenuBySlugSwagger, GetMenusSwagger, UpdateMenuSwagger } from './menu.swagger';

@Controller('menus')
@ApiExtraModels(MenuDTO, SubMenuDTO)
@ApiForbiddenResponse({ description: ErrorMessage.INVALID_ACCESS })
export class MenuController {
  constructor(
    private readonly menuService: MenuService
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

}
