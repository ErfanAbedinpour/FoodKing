import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { MenuRepository } from "./repository/abstract/menu.repository";
import { CreateMenuDTO } from "./DTO/create-menu.dto";
import slugify from "slugify";

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
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }

}