import { Test, TestingModule } from '@nestjs/testing';
import { SubMenuService } from '../sub-menu/sub-menu.service';
import { SubMenuRepository } from '../repository/abstract/sub-menu.repository';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubMenuDTO } from '../DTO/create-sub-menu.dto';
import { UpdateSubMenuDTO } from '../DTO/update-sub-menu.dto';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { RepositoryException } from '../../../exception/repository.exception';
import { SubMenuModel } from '@models/sub-menu.model';

describe('SubMenuService', () => {
  let service: SubMenuService;
  let repository: jest.Mocked<SubMenuRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubMenuService,
        {
          provide: SubMenuRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SubMenuService>(SubMenuService);
    repository = module.get(SubMenuRepository);
  });

  describe('create', () => {
    const menuId = 1;
    const createSubMenuDto: CreateSubMenuDTO = {
      title: 'Test SubMenu',
      slug: 'test-submenu',
      en_title: 'Test SubMenu EN',
    };

    it('should create a submenu successfully', async () => {
      const expectedResult: SubMenuModel = {
        id: 1,
        title: createSubMenuDto.title,
        slug: 'test-submenu',
        en_title: createSubMenuDto.en_title,
        menu: { id: menuId } as any,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      repository.create.mockResolvedValueOnce(expectedResult);

      const result = await service.create(menuId, createSubMenuDto);

      expect(repository.create).toHaveBeenCalledWith(menuId, {
        title: createSubMenuDto.title,
        slug: 'test-submenu',
        en_title: createSubMenuDto.en_title,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException when repository throws RepositoryException', async () => {
      repository.create.mockRejectedValue(new RepositoryException(ErrorMessage.MENU_NOT_FOUND));

      expect(service.create(menuId, createSubMenuDto)).rejects.toThrow(BadRequestException);
      expect(service.create(menuId, createSubMenuDto)).rejects.toThrow(ErrorMessage.MENU_NOT_FOUND);
    });

    it('should throw BadRequestException when slug is not unique', async () => {
      repository.create.mockRejectedValue(new UniqueConstraintViolationException(new Error(ErrorMessage.INVALID_SUB_MENU_SLUG)));

      expect(service.create(menuId, createSubMenuDto)).rejects.toThrow(BadRequestException);
      expect(service.create(menuId, createSubMenuDto)).rejects.toThrow(ErrorMessage.INVALID_SUB_MENU_SLUG);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      repository.create.mockRejectedValue(new Error('Unknown error'));

      expect(service.create(menuId, createSubMenuDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const subMenuId = 1;
    const updateSubMenuDto: UpdateSubMenuDTO = {
      title: 'Updated SubMenu',
      slug: 'updated-submenu',
      en_title: 'Updated SubMenu EN',
    };

    it('should update a submenu successfully', async () => {
      const expectedResult: SubMenuModel = {
        id: subMenuId,
        title: updateSubMenuDto.title!,
        slug: updateSubMenuDto.slug!,
        en_title: updateSubMenuDto.en_title!,
        menu: { id: 1 } as any,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      repository.update.mockResolvedValueOnce(expectedResult);

      const result = await service.update(subMenuId, updateSubMenuDto);

      expect(repository.update).toHaveBeenCalledWith(subMenuId, updateSubMenuDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when submenu is not found', async () => {
      repository.update.mockRejectedValue(new NotFoundException());

      expect(service.update(subMenuId, updateSubMenuDto)).rejects.toThrow(NotFoundException);
      expect(service.update(subMenuId, updateSubMenuDto)).rejects.toThrow(ErrorMessage.SUB_MENU_NOT_FOUND);
    });

    it('should throw BadRequestException when slug is not unique', async () => {
      repository.update.mockRejectedValue(new UniqueConstraintViolationException(new Error('Duplicate slug')));

      expect(service.update(subMenuId, updateSubMenuDto)).rejects.toThrow(BadRequestException);
      expect(service.update(subMenuId, updateSubMenuDto)).rejects.toThrow(ErrorMessage.INVALID_SUB_MENU_SLUG);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      repository.update.mockRejectedValue(new Error('Unknown error'));

      expect(service.update(subMenuId, updateSubMenuDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    const subMenuId = 1;

    it('should delete a submenu successfully', async () => {
      repository.delete.mockResolvedValueOnce(true);

      const result = await service.delete(subMenuId);

      expect(repository.delete).toHaveBeenCalledWith(subMenuId);
      expect(result).toEqual({ msg: 'subMenu Removed successfully' });
    });

    it('should throw NotFoundException when submenu is not found', async () => {
      repository.delete.mockResolvedValue(false);

      expect(service.delete(subMenuId)).rejects.toThrow(NotFoundException);
      expect(service.delete(subMenuId)).rejects.toThrow(ErrorMessage.SUB_MENU_NOT_FOUND);
    });
  });
});
