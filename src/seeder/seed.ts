import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Role, UserRole } from "@models/index"
export class DatabaseSeeder extends Seeder {

    async run(em: EntityManager): Promise<void> {
        // create role
        const Customer = em.create(Role, { name: UserRole.Customer });
        const Delivery = em.create(Role, { name: UserRole.Delivery });
        const owner = em.create(Role, { name: UserRole.RestaurantOwner });
        const manager = em.create(Role, { name: UserRole.Manager });
        await em.persistAndFlush([CustomElementRegistry, Delivery, owner, manager]);
    }
}
