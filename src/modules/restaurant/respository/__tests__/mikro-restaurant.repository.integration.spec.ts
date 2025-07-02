import { EntityManager, MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { MikroRestaurantRepository } from '../mikro-restaurant.repository';
import { Restaurant } from '@models/restaurant.model';
import { User } from '@models/user.model';
import { RestaurantPersist } from '../persistance/restaurant-persist';
import { RepositoryException } from '../../../common/exception/repository.exception';
import { Role } from '@models/role.model';
import { UserRole } from '@models/role.model';
import { Cart } from '@models/cart.model';
import { Test } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';

describe('MikroRestaurantRepository Integration Tests', () => {
    let orm: MikroORM;
    let em: EntityManager;
    let repository: MikroRestaurantRepository;
    let testUser: User;
    let testRole: Role;
    let testCart: Cart;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({

            imports: [MikroOrmModule.forRoot({
                driver: SqliteDriver,
                dbName: ':memory:',
                entities: [Restaurant, User, Role, Cart],
                debug: false,
                ensureDatabase: { create: true },
                allowGlobalContext: true
            })],
            providers: [MikroRestaurantRepository]

        }).compile()

        em = moduleRef.get(EntityManager);
        orm = moduleRef.get(MikroORM)
        repository = moduleRef.get(MikroRestaurantRepository)


        testRole = em.create(Role, {
            name: UserRole.Owner
        }, { persist: true });

        testUser = em.create(User, {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone_number: '1234567890',
            role: testRole,
            is_active: true,
            createdAt: Date.now(),
            cart: {},
        }, { persist: true });

        testCart = em.create(Cart, {
            user: testUser,
        }, { persist: true });

        testUser.cart = testCart;

        await em.flush();
    });

    afterAll(async () => {
        await orm.close();
    });

    describe('create', () => {
        it('should create a new restaurant', async () => {
            const restaurantData: RestaurantPersist = {
                name: 'Test Restaurant',
                en_name: 'Test Restaurant EN',
                owner_id: testUser.id
            };

            const restaurant = await repository.create(restaurantData);

            expect(restaurant).toBeDefined();
            expect(restaurant.name).toBe(restaurantData.name);
            expect(restaurant.en_name).toBe(restaurantData.en_name);
            expect(restaurant.ownerId.id).toBe(testUser.id);
        });

        it('should throw exception when creation fails', async () => {
            const invalidData: RestaurantPersist = {
                name: 'Test Restaurant',
                en_name: 'Test Restaurant EN',
                owner_id: 999999
            };

            await expect(repository.create(invalidData)).rejects.toThrow(RepositoryException);
        });
    });

    describe('findOne', () => {
        it('should find restaurant by id', async () => {
            const restaurantData: RestaurantPersist = {
                name: 'Find Test Restaurant',
                en_name: 'Find Test Restaurant EN',
                owner_id: testUser.id
            };

            const created = await repository.create(restaurantData);
            const found = await repository.findOne(created.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(created.id);
            expect(found.name).toBe(restaurantData.name);
        });

        it('should throw exception when restaurant not found', async () => {
            await expect(repository.findOne(999999)).rejects.toThrow(RepositoryException);
        });
    });

    describe('findAll', () => {
        it('should return all restaurants', async () => {
            const restaurant1: RestaurantPersist = {
                name: 'Restaurant 1',
                en_name: 'Restaurant 1 EN',
                owner_id: testUser.id
            };

            const restaurant2: RestaurantPersist = {
                name: 'Restaurant 2',
                en_name: 'Restaurant 2 EN',
                owner_id: testUser.id
            };

            await repository.create(restaurant1);
            await repository.create(restaurant2);

            const restaurants = await repository.findAll();

            expect(restaurants).toHaveLength(2);
            expect(restaurants[0].name).toBe(restaurant1.name);
            expect(restaurants[1].name).toBe(restaurant2.name);
        });
    });

    describe('update', () => {
        it('should update restaurant', async () => {
            const restaurantData: RestaurantPersist = {
                name: 'Update Test Restaurant',
                en_name: 'Update Test Restaurant EN',
                owner_id: testUser.id
            };

            const created = await repository.create(restaurantData);
            const updateData = {
                name: 'Updated Name',
                en_name: 'Updated EN Name'
            };

            const updated = await repository.update(created.id, updateData);

            expect(updated.name).toBe(updateData.name);
            expect(updated.en_name).toBe(updateData.en_name);
        });

        it('should throw exception when update fails', async () => {
            const updateData = {
                name: 'Updated Name',
                en_name: 'Updated EN Name'
            };

            await expect(repository.update(999999, updateData)).rejects.toThrow(RepositoryException);
        });
    });

    describe('delete', () => {
        it('should delete restaurant', async () => {
            const restaurantData: RestaurantPersist = {
                name: 'Delete Test Restaurant',
                en_name: 'Delete Test Restaurant EN',
                owner_id: testUser.id
            };

            const created = await repository.create(restaurantData);
            const deleted = await repository.delete(created.id);

            expect(deleted.id).toBe(created.id);
            await expect(repository.findOne(created.id)).rejects.toThrow(RepositoryException);
        });

        it('should throw exception when delete fails', async () => {
            await expect(repository.delete(999999)).rejects.toThrow(RepositoryException);
        });
    });
}); 