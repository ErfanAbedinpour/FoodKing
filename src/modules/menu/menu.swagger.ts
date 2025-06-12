import { applyDecorators } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    getSchemaPath,
} from "@nestjs/swagger";
import { CreateMenuDTO } from "./DTO/create-menu.dto";
import { MenuDTO } from "./DTO/menu.DTO";
import { SubMenuDTO } from "./DTO/sub-menu.DTO";
import { UpdateMenuDTO } from "./DTO/update-menu.dto";
import { CreateSubMenuDTO } from "./DTO/create-sub-menu.dto";
import { UpdateSubMenuDTO } from "./DTO/update-sub-menu.dto";

export function CreateMenuSwagger() {
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiBody({ type: CreateMenuDTO }),
        ApiCreatedResponse({
            description: 'Menu and subMenu Created',
            schema: { type: 'object', properties: { msg: { type: 'string' } } },
        })
    )
}

export function GetMenusSwagger() {
    return applyDecorators(
        ApiOkResponse({
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
        }),
    );
}

export function GetMenuBySlugSwagger() {
    return applyDecorators(
        ApiOkResponse({
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
        }),
        ApiNotFoundResponse({ description: 'menu not found' }),
    );
}

export function UpdateMenuSwagger() {
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiOkResponse({ type: MenuDTO }),
        ApiNotFoundResponse({ description: 'menu not found' }),
        ApiBody({ type: UpdateMenuDTO }),
    );
}

export function DeleteMenuSwagger() {
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiNotFoundResponse({ description: 'menu not found' }),
        ApiOkResponse({
            description: 'menu removed',
            schema: { properties: { msg: { type: 'string' } } },
        }),
    );
}

export function AddSubMenuSwagger() {
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiParam({ name: "menuId", description: "menu Id" }),
        ApiCreatedResponse({ type: SubMenuDTO }),
        ApiBadRequestResponse({ description: "menuId is invalid." }),
        ApiBody({ type: CreateSubMenuDTO }),
    );
}

export function DeleteSubMenuSwagger() {
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiParam({ name: "subMenuId", description: "subMenuId" }),
        ApiOkResponse({ description: "submenu Removed successfully", schema: { properties: { msg: { type: 'string' } } } }),
        ApiNotFoundResponse({ description: "sub Menu not found" }),
    );
}

export function UpdateSubMenuSwagger() {
    return applyDecorators(
        ApiBearerAuth("JWT-AUTH"),
        ApiParam({ name: "subMenuId", description: "subMenuId" }),
        ApiOkResponse({ description: "sub Menu updated", type: SubMenuDTO }),
        ApiNotFoundResponse({ description: "sub Menu not found" }),
        ApiBody({ type: UpdateSubMenuDTO }),
    );
}