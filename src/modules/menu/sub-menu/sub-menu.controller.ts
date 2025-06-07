import { UserRole } from "@models/role.model";
import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { IsAuth } from "src/modules/common/decorator/auth.decorator";
import { RoleAccess } from "src/modules/common/decorator/role-access.decorator";
import { AddSubMenuSwagger, DeleteSubMenuSwagger, UpdateSubMenuSwagger } from "../menu.swagger";
import { CreateSubMenuDTO } from "../DTO/create-sub-menu.dto";
import { SubMenuService } from "./sub-menu.service";
import { UpdateSubMenuDTO } from "../DTO/update-sub-menu.dto";
import { ApiExtraModels, ApiParam, ApiTags } from "@nestjs/swagger";
import { SubMenuDTO } from "../DTO/sub-menu.DTO";

@Controller('menus/:menuId/sub-menus')
@ApiTags("sub-menus")
@ApiParam({ name: "menuId", description: "menu Id" })
@ApiExtraModels(SubMenuDTO)
export class SubMenuController {
    constructor(private readonly subMenuService: SubMenuService) { }

    @Post()
    @IsAuth()
    @RoleAccess(UserRole.Owner)
    @AddSubMenuSwagger()
    addSubMenu(@Param("menuId", ParseIntPipe) menuId: number, @Body() createSubMenuDto: CreateSubMenuDTO) {
        return this.subMenuService.create(menuId, createSubMenuDto)
    }

    @Delete(":subMenuId")
    @IsAuth()
    @RoleAccess(UserRole.Owner)
    @DeleteSubMenuSwagger()
    deleteSubMenu(@Param("menuId", ParseIntPipe) menuId: number, @Param("subMenuId", ParseIntPipe) subMenuId: number) {
        return this.subMenuService.delete(menuId, subMenuId)
    }

    @Patch(":subMenuId")
    @IsAuth()
    @RoleAccess(UserRole.Owner)
    @UpdateSubMenuSwagger()
    updateSubMenu(@Param("menuId", ParseIntPipe) menuId: number, @Param("subMenuId", ParseIntPipe) subMenuId: number, @Body() updateSubMenu: UpdateSubMenuDTO) {
        return this.subMenuService.update(menuId, subMenuId, updateSubMenu)
    }

}