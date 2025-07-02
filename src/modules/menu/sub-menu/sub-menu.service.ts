import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { SubMenuRepository } from "../repository/abstract/sub-menu.repository";
import { CreateSubMenuDTO } from "../DTO/create-sub-menu.dto";
import slugify from "slugify";
import { RepositoryException } from "../../common/exception/repository.exception";
import { UpdateSubMenuDTO } from "../DTO/update-sub-menu.dto";
import { ErrorMessage } from "../../../ErrorMessages/Error.enum";
import { UniqueConstraintViolationException } from "@mikro-orm/core";

@Injectable()
export class SubMenuService {
    constructor(private readonly subMenuRepository: SubMenuRepository) { }

    private readonly logger = new Logger(SubMenuService.name)

    async create(menuId: number, subMenuData: CreateSubMenuDTO) {
        try {
            const result = await this.subMenuRepository.create(menuId, { en_title: subMenuData.en_title, slug: slugify(subMenuData.slug, { lower: true, replacement: '-', trim: true }), title: subMenuData.title })
            return result
        } catch (err) {
            if (err instanceof RepositoryException)
                throw new BadRequestException(err.message)

            if (err instanceof UniqueConstraintViolationException)
                throw new BadRequestException(ErrorMessage.INVALID_SUB_MENU_SLUG)

            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }


    async update(menuId: number, id: number, data: UpdateSubMenuDTO) {
        try {
            const result = await this.subMenuRepository.update(menuId, id, data)
            return result
        } catch (err) {
            if (err instanceof HttpException)
                throw new NotFoundException(ErrorMessage.SUB_MENU_NOT_FOUND)

            if (err instanceof UniqueConstraintViolationException)
                throw new BadRequestException(ErrorMessage.INVALID_SUB_MENU_SLUG)

            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }


    async delete(menuId: number, id: number) {
        const result = await this.subMenuRepository.delete(menuId, id)

        if (!result)
            throw new NotFoundException(ErrorMessage.SUB_MENU_NOT_FOUND)

        return { msg: "subMenu Removed successfully" }

    }

}