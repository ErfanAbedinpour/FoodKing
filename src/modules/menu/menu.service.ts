import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { MenuRepository } from "./repository/abstract/menu.repository";
import { CreateMenuDTO } from "./DTO/create-menu.dto";
import slugify from "slugify";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { ErrorMessage } from "../../ErrorMessages/Error.enum";

@Injectable()
export class MenuService {
    private logger = new Logger(MenuService.name)

    constructor(private readonly menuRepository: MenuRepository) { }


    async create(dto: CreateMenuDTO) {
        const serializerSub = dto.sub_menu.map(s => ({ ...s, slug: slugify(s.slug, { lower: true, trim: true, replacement: "-" }) }));

        try {
            const data = { en_title: dto.en_title, slug: slugify(dto.slug, { lower: true, trim: true, replacement: '-' }), sub_menus: serializerSub, title: dto.title };
            await this.menuRepository.create(data)

            return {
                msg: "Menu Saved successfully",
                data
            }

        } catch (err) {
            if (err instanceof UniqueConstraintViolationException) {
                //@ts-ignore
                if (err.table === "sub-menu") {
                    //@ts-ignore
                    const errorMessage = err.detail;
                    const [_, value] = RegExp(/=(\(\w.+\))/).exec(errorMessage) ?? []
                    throw new BadRequestException(`${value ?? ""} in ${ErrorMessage.INVALID_SUB_MENU_SLUG}`)
                } else {
                    throw new BadRequestException(ErrorMessage.INVALID_MENU_SLUG)
                }
            }
            throw new BadRequestException(ErrorMessage.INVALID_MENU_SLUG)

            throw new InternalServerErrorException()
        }
    }

}