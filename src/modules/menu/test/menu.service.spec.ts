import { Test } from '@nestjs/testing';
import { MenuService } from '../menu.service';
import { MenuRepository } from '../repository/abstract/menu.repository';
import { MenuRepositoryMock } from './mock/menu.repository';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';

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
      ErrorMessage.INVALID_MENU_SLUG,
    );
  });
});
