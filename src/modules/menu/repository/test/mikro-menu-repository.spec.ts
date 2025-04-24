import { Test } from "@nestjs/testing"
import { MenuRepository } from "../abstract/menu.repository"
import { MikroMenuRepository } from "../mikro-orm-menu-repository";

describe("MikroMenuRepository", () => {

    let mikroRepository: MenuRepository;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: MenuRepository,
                    useClass: MikroMenuRepository
                }
            ]
        }).compile()

    })

})