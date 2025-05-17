import { MikroProductRepository } from '../mikro-product.repository';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Product } from '@models/product.model';
import { User } from '@models/user.model';
import { Restaurant } from '@models/restaurant.model';
import { ProductPersist } from '../persistance/product';
import Decimal from 'decimal.js';
import { ProductCategory } from '@models/product-category.model';
import { Category } from '@models/category.model';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { RepositoryException } from '../../../../exception/repository.exception';
import { Test } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role, UserRole } from '../../../../models';

describe('MikroProductRepository Behavior Tests', () => {
  let repository: MikroProductRepository;
  let em: EntityManager;
  let orm: MikroORM;
  let mockRole: Role;
  let mockUser: User;
  let mockRestaurant: Restaurant;
  let mockCategory: Category;
  let mockProductData: ProductPersist;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          entities: ['./dist/models/*.model.js'],
          dbName: ':memory:',
          ensureDatabase: { create: true },
          allowGlobalContext: true,
          driver: SqliteDriver,
        }),
      ],
      providers: [MikroProductRepository],
    }).compile();

    repository = module.get<MikroProductRepository>(MikroProductRepository);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);

    mockRole = em.create(Role, {
      id: 1,
      name: 'Customer' as UserRole,
    });

    mockUser = em.create(User, {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: mockRole,
      cart: {},
      is_active: true,
      phone_number: '',
    });

    mockRestaurant = em.create(Restaurant, {
      id: 1,
      en_name: 'test-name',
      name: 'Test Restaurant',
      ownerId: mockUser,
    });

    mockCategory = em.create(Category, {
      id: 1,
      name: 'Test Category',
      slug: 'test-category',
      en_name: 'test',
      user: mockUser,
      isActivate: true,
    });

    mockProductData = {
      name: 'Test Product',
      description: 'Test Description',
      slug: 'test-product',
      inventory: 10,
      user_id: 1,
      price: new Decimal('99.99'),
      categories: [mockCategory],
      restaurant: mockRestaurant,
    };
    await em.persistAndFlush(mockRole);
    await em.persistAndFlush(mockUser);
    await em.persistAndFlush(mockRestaurant);
    await em.persistAndFlush(mockCategory);
  });

  it('Should be defined', () => {
    expect(EntityManager).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product with category', async () => {
      const product = await repository.create(mockProductData);

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(mockProductData.name);
      expect(product.slug).toBe(mockProductData.slug);
      expect(product.price.toString()).toBe(mockProductData.price.toString());
      expect(product.inventory).toBe(mockProductData.inventory);
      expect(product.user.id).toBe(mockProductData.user_id);
      expect(product.restaurant.id).toBe(mockProductData.restaurant.id);

      const productWithCategory = await em.findOne(
        Product,
        { id: product.id },
        { populate: ['category'] },
      );
      expect(productWithCategory?.category.length).toBe(1);
      expect(productWithCategory?.category[0].category.id).toBe(
        mockCategory.id,
      );
    });

    it('should throw error when creating product with duplicate slug', async () => {
      await repository.create(mockProductData);
      expect(repository.create(mockProductData)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const createdProduct = await repository.create(mockProductData);
      const foundProduct = await repository.findById(createdProduct.id);

      expect(foundProduct).toBeDefined();
      expect(foundProduct.id).toBe(createdProduct.id);
      expect(foundProduct.name).toBe(mockProductData.name);
    });

    it('should throw error when product not found', async () => {
      expect(repository.findById(999)).rejects.toThrow(
        'Product with id 999 not found',
      );
    });
  });

  describe('findBySlug', () => {
    it('should find product by slug', async () => {
      const createdProduct = await repository.create(mockProductData);
      const foundProduct = await repository.findBySlug(mockProductData.slug);

      expect(foundProduct).toBeDefined();
      expect(foundProduct.id).toBe(createdProduct.id);
      expect(foundProduct.slug).toBe(mockProductData.slug);
    });

    it('should throw RepositoryException when product not found', async () => {
      expect(repository.findBySlug('non-existent')).rejects.toThrow(
        RepositoryException,
      );
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const createdProduct = await repository.create(mockProductData);
      const updateData = {
        name: 'Updated Name',
        price: new Decimal('149.99'),
      };

      const updatedProduct = await repository.update(
        createdProduct.id,
        updateData,
      );

      expect(updatedProduct.name).toBe(updateData.name);
      expect(updatedProduct.price.toString()).toBe(updateData.price.toString());
      expect(updatedProduct.id).toBe(createdProduct.id);
    });

    it('should throw error when updating non-existent product', async () => {
      expect(repository.update(999, { name: 'Updated Name' })).rejects.toThrow(
        'Product with id 999 not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      const createdProduct = await repository.create(mockProductData);
      const deletedProduct = await repository.delete(createdProduct.id);

      expect(deletedProduct.id).toBe(createdProduct.id);
    });

    it('should throw error when deleting non-existent product', async () => {
      expect(repository.delete(999)).rejects.toThrow(
        'Product with id 999 not found',
      );
    });
  });

  afterAll(async () => {
    await orm.close();
  });
});
