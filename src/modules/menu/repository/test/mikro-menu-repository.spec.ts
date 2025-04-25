import { Test } from "@nestjs/testing"
import { MenuRepository } from "../abstract/menu.repository"
import { MikroMenuRepository } from "../mikro-orm-menu-repository";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MenuModel, SubMenuModel } from "../../../../models";
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite'

describe("MikroMenuRepository", () => {

    let mikroRepository: MenuRepository;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [
                MikroOrmModule.forRoot({
                    allowGlobalContext: true,
                    driver: BetterSqliteDriver,
                    autoLoadEntities: true,
                    ensureDatabase: { create: true },
                    dbName: ":memory:",
                    entities: [MenuModel, SubMenuModel],
                })
            ],
            providers: [
                {
                    provide: MenuRepository,
                    useClass: MikroMenuRepository
                }
            ]
        }).compile()

        mikroRepository = moduleRef.get(MenuRepository)
    })


    it("HAPPY PATH", () => {
        expect(mikroRepository).toBeDefined()
    })
})