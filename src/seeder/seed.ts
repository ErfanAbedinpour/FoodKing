import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role, UserRole } from '../models/index';
import { Category, MenuModel, Product, ProductCategory, Restaurant, SubMenuModel, User } from '../models';
import { faker } from '@faker-js/faker';
import { readFileSync } from 'fs'
import Decimal from 'decimal.js';
import { join } from 'path';




export class DatabaseSeeder extends Seeder {

  // Import Product Seeder from json file Because Faker.js cannot Generate Persian food name and description.

  private products = JSON.parse(readFileSync(join(process.cwd(), "src", "seeder", 'product.json'), 'utf8')) as { name: string, slug: string, description: string }[]
  async run(em: EntityManager): Promise<void> {
    // role Seed
    em.create(Role, { name: UserRole.Customer });
    em.create(Role, { name: UserRole.Delivery });
    const owner = em.create(Role, { name: UserRole.Owner });

    // userSeed
    const user = em.create(User, {
      email: 'test@example.com',
      password: 'admin',
      role: owner,
      name: "owner",
      phone_number: "09117897203",
      is_active: true,
      cart: {}
    });

    // Menu Seed
    const menu1 = em.create(MenuModel, {
      en_title: faker.lorem.word(),
      title: faker.lorem.word(),
      slug: faker.lorem.slug().toLowerCase(),
    })

    const menu2 = em.create(MenuModel, {
      en_title: faker.lorem.word(),
      title: faker.lorem.word(),
      slug: faker.lorem.slug().toLowerCase(),
    })

    // SubMenu Seed
    em.create(SubMenuModel, {
      en_title: faker.lorem.word(),
      title: faker.lorem.word(),
      slug: faker.lorem.slug().toLowerCase(),
      menu: menu1,
    })

    em.create(SubMenuModel, {
      en_title: faker.lorem.word(),
      title: faker.lorem.word(),
      slug: faker.lorem.slug().toLowerCase(),
      menu: menu2,
    })


    //Category Seed
    const category1 = em.create(Category, {
      en_name: faker.food.ethnicCategory(),
      name: faker.food.ethnicCategory(),
      slug: faker.lorem.slug().toLowerCase(),
      user: user,
      isActivate: true,
    })


    const category2 = em.create(Category, {
      en_name: faker.food.ethnicCategory(),
      name: faker.food.ethnicCategory(),
      slug: faker.lorem.slug().toLowerCase(),
      user: user,
      isActivate: true,
    })


    em.create(Category, {
      en_name: faker.food.ethnicCategory(),
      name: faker.food.ethnicCategory(),
      slug: faker.lorem.slug().toLowerCase(),
      user: user,
      isActivate: true,
    })

    em.create(Category, {
      en_name: faker.food.ethnicCategory(),
      name: faker.food.ethnicCategory(),
      slug: faker.lorem.slug().toLowerCase(),
      user: user,
      isActivate: true,
    })

    // Restaurant Seed
    const restaurant1 = em.create(Restaurant, {
      en_name: faker.lorem.word(),
      name: faker.lorem.word(),
      ownerId: user,
    })


    const restaurant2 = em.create(Restaurant, {
      en_name: faker.lorem.word(),
      name: faker.lorem.word(),
      ownerId: user,
    })

    // Product Seed
    for (let i = 0; i < this.products.length; i++) {

      const product = em.create(Product, {
        description: this.products[i].description,
        name: this.products[i].name,
        slug: this.products[i].slug,
        is_active: true,
        inventory: faker.number.int({ min: 1, max: 10 }),
        user: user,
        price: Decimal(faker.number.int({ min: 1000, max: 10000 })),
        restaurant: i % 2 == 0 ? restaurant1 : restaurant2
      })
      // ProductCategory Seed
      product.category.add(em.create(ProductCategory, { product, category: category1 }))
      product.category.add(em.create(ProductCategory, { product, category: category2 }))
    }
  }
}