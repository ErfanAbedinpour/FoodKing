import { Test } from '@nestjs/testing';
import { MenuService } from '../menu.service';
import { MenuRepository } from '../repository/abstract/menu.repository';
import { MenuRepositoryMock } from './mock/menu.repository';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';
import { MenuModel } from '../../../models';

describe('MenuService', () => {
  let service: MenuService;
  let repository: MenuRepository;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: MenuRepository,
          useValue: MenuRepositoryMock,
        },
      ],
    }).compile();

    service = moduleRef.get(MenuService);
    repository = moduleRef.get(MenuRepository);
  });

  it('Should be defined', function () {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('Should be Throw BadRequest Exception Because Invalid Slug for Menu', function () {
    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw new UniqueConstraintViolationException({
        message: 'Slug is invalid',
        name: 'UniqueConstraintViolationException',
        cause: '',
        stack: '',
      });
    });

    const payload = {
      en_title: 'ent-title',
      slug: 'slug',
      title: 'title',
      sub_menu: [],
    };
    expect(service.create(payload)).rejects.toThrow(BadRequestException);
    expect(service.create(payload)).rejects.toThrow(
      ErrorMessage.INVALID_MENU_SLUG,
    );
  });

  it('Should be Throw BadRequest Because Invalid SubMenu Slug', () => {
    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw new UniqueConstraintViolationException({
        message: 'Slug is invalid',
        name: 'UniqueConstraintViolationException',
        cause: '',
        stack: '',
        //@ts-ignore
        table: 'sub-menu',
        //@ts-ignore
        detail: 'Key (slug)=(test-slug) already exists.',
      });
    });

    const payload = {
      en_title: 'ent-title',
      slug: 'slug',
      title: 'title',
      sub_menu: [],
    };

    expect(service.create(payload)).rejects.toThrow(BadRequestException);
    expect(service.create(payload)).rejects.toThrow(
      ErrorMessage.INVALID_SUB_MENU_SLUG + "(test-slug)",
    );
  });


  it("Should be created Menu Successfully", async () => {
    jest.spyOn(repository, 'create').mockResolvedValueOnce()

    const payload = {
      en_title: 'ent-title',
      slug: 'slug',
      title: 'title',
      sub_menu: [],
    };

    const result = await service.create(payload);
    expect(repository.create).toHaveBeenCalled();
    expect(result.msg).toEqual("Menu Saved successfully");
    expect(result.data).toEqual({ en_title: payload.en_title, slug: payload.slug, sub_menus: [], title: payload.title })
  })

  it("Should be throw NotFound Because menu not found", async () => {
    jest.spyOn(repository, 'findBySlug').mockResolvedValue(null)
    expect(service.findBySlug("")).rejects.toThrow(NotFoundException)
    expect(service.findBySlug("")).rejects.toThrow(ErrorMessage.MENU_NOT_FOUND)
  })

  it("Should be find Menu Successful By Slug", async () => {
    jest.spyOn(repository, 'findBySlug').mockResolvedValueOnce({ slug: "test", title: "test-title" } as MenuModel)


    const result = await service.findBySlug("slug");
    expect(result.title).toEqual('test-title')
    expect(result.slug).toEqual('test')
    expect(repository.findBySlug).toHaveBeenCalledWith("slug", true)
  })


  it("should be deleted Menu", async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(true)

    const result = await service.delete(1)
    expect(result.msg).toEqual("Menu Removed successfully")
    expect(repository.delete).toHaveBeenCalledWith(1)
  })


  it("Should be updated Menu", async () => {
    jest.spyOn(repository, 'update').mockResolvedValue({ slug: 'test-slug', title: "test-title" } as MenuModel)
    const payload = {
      slug: 'slug',
      title: 'title',
    };

    const result = await service.updateMenu(1, payload);
    expect(result.slug).toEqual('test-slug')
  })
});
