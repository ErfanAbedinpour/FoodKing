import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MenuRepository } from './repository/abstract/menu.repository';
import { CreateMenuDTO } from './DTO/create-menu.dto';
import slugify from 'slugify';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';
import { UpdateMenuDTO } from './DTO/update-menu.dto';
import { RepositoryException } from 'src/exception/repository.exception';

@Injectable()
export class MenuService {
  private logger = new Logger(MenuService.name);

  constructor(private readonly menuRepository: MenuRepository) { }

  async create(dto: CreateMenuDTO) {
    const serializerSub = dto.sub_menu.map((s) => ({
      ...s,
      slug: slugify(s.slug, { lower: true, trim: true, replacement: '-' }),
    }));

    const data = {
      en_title: dto.en_title,
      slug: slugify(dto.slug, { lower: true, trim: true, replacement: '-' }),
      sub_menus: serializerSub,
      title: dto.title,
    };

    try {
      await this.menuRepository.create(data);

      return {
        msg: 'Menu Saved successfully',
        data,
      };
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        //@ts-ignore
        if (err.table === 'sub-menu') {
          //@ts-ignore
          const errorMessage = err.detail;
          const [_, value] = RegExp(/=(\(\w.+\))/).exec(errorMessage) ?? [];
          throw new BadRequestException(
            `${ErrorMessage.INVALID_SUB_MENU_SLUG}${value}`,
          );
        }
        throw new BadRequestException(ErrorMessage.INVALID_MENU_SLUG);
      }
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findBySlug(slug: string) {
    const result = await this.menuRepository.findBySlug(slug, true);
    if (!result) throw new NotFoundException(ErrorMessage.MENU_NOT_FOUND);
    return result;
  }

  async delete(id: number) {
    try {
      const result = await this.menuRepository.delete(id);
      if (!result) throw new NotFoundException(ErrorMessage.MENU_NOT_FOUND);
      return { msg: 'Menu Removed successfully' };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return this.menuRepository.findAll(true);
  }

  async updateMenu(id: number, data: UpdateMenuDTO) {
    try {
      const result = await this.menuRepository.update(id, data);
      return result;
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new NotFoundException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
