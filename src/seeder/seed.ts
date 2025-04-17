import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role, UserRole } from "@models/index"

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        // create role
        em.create(Role, { name: UserRole.Customer });
        em.create(Role, { name: UserRole.Delivery });
        em.create(Role, { name: UserRole.RestaurantOwner });
        em.create(Role, { name: UserRole.Manager });
    }
}
