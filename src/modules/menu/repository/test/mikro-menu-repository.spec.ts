import { Test } from '@nestjs/testing';
import { MenuRepository } from '../abstract/menu.repository';
import { MikroMenuRepository } from '../mikro-orm-menu-repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MenuModel, SubMenuModel } from '../../../../models';
import { BetterSqliteDriver, EntityManager } from '@mikro-orm/better-sqlite';
import { MenuPersist } from '../abstract/persist/menu.persist';
import { RepositoryException } from '../../../../exception/repository.exception';
import { ErrorMessage } from '../../../../ErrorMessages/Error.enum';

describe('MikroMenuRepository', () => {
  let mikroRepository: MenuRepository;
  let entityManger: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          allowGlobalContext: true,
          driver: BetterSqliteDriver,
          autoLoadEntities: true,
          ensureDatabase: { create: true },
          dbName: ':memory:',
          entities: [MenuModel, SubMenuModel],
        }),
      ],
      providers: [
        {
          provide: MenuRepository,
          useClass: MikroMenuRepository,
        },
      ],
    }).compile();

    mikroRepository = moduleRef.get(MenuRepository);
    entityManger = moduleRef.get(EntityManager);
  });

  it('HAPPY :)', () => {
    expect(mikroRepository).toBeDefined();
    expect(entityManger).toBeDefined();
  });

  beforeEach(async () => {
    for (let i = 1; i <= 10; i++) {
      const payload: MenuPersist = {
        en_title: `menu-${i}`,
        slug: `/slug-${i}`,
        sub_menus: [
          { en_title: `first-${i}`, slug: `/first-${i}`, title: `first` },
        ],
        title: `title-${i}`,
      };

      entityManger.persist(entityManger.create(MenuModel, payload));
    }

    await entityManger.flush();
  });

  it('Should be create Menu and subs', async () => {
    const payload: MenuPersist = {
      en_title: 'menu-en',
      slug: '/menu',
      sub_menus: [
        { en_title: 'first', slug: '/first', title: 'first' },
        { en_title: 'second', slug: '/second', title: 'second' },
      ],
      title: 'menu',
    };

    await mikroRepository.create(payload);

    const result = await mikroRepository.findBySlug('/menu');
    expect(result?.title).toEqual('menu');
    expect(result?.slug).toEqual('/menu');
    expect(result?.subs_menus.length).toEqual(2);
    expect(result?.en_title).toEqual('menu-en');
  });

  it('findAll', async () => {
    const result = await mikroRepository.findAll(true);
    expect(result.length).toEqual(10);
  });

  it('findById', async () => {
    const result = await mikroRepository.findById(1);
    expect(result?.title).toEqual('title-1');
    expect(result?.en_title).toEqual('menu-1');
    expect(result?.slug).toEqual('/slug-1');
  });

  it('findBySlug', async () => {
    const result = await mikroRepository.findBySlug('/slug-1');
    expect(result?.title).toEqual('title-1');
    expect(result?.en_title).toEqual('menu-1');
    expect(result?.slug).toEqual('/slug-1');
  });

  it('Should be Removed and return true', async () => {
    const result = await mikroRepository.delete(1);
    expect(result).toEqual(true);
  });

  it('Should be Return false because menu not found', async () => {
    const result = await mikroRepository.delete(25);
    expect(result).toEqual(false);
  });

  it('Should be throw Repository Error Because Menu not found', async () => {
    expect(mikroRepository.update(25, {})).rejects.toThrow(RepositoryException);
    expect(mikroRepository.update(25, {})).rejects.toThrow(
      ErrorMessage.MENU_NOT_FOUND,
    );
  });

  it('Should be updated ', async () => {
    const result = await mikroRepository.update(1, { title: 'new-title-1' });
    expect(result.title).toEqual('new-title-1');
    const menu = await mikroRepository.findById(1);
    expect(menu?.title).toEqual('new-title-1');
  });
});
