import { EntityManager } from "@mikro-orm/postgresql";
import { UserSessionRepository } from "../../domain/repository/user-session.repository";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { Session } from '@models/index'

@Injectable()
export class MikroOrmUserSessionRepository implements UserSessionRepository {
    constructor(private readonly em: EntityManager) { }


    async create(userId: number, token: string, tokenId: string): Promise<void> {
        const session = this.em.create(Session, { token, tokenId, user: userId, exp: 7 * 24 * 60 * 60 * 1000 + Date.now() });

        try {
            await this.em.persistAndFlush(session)
            return
        } catch (err) {
            throw err;
        }
    }

    async destroy(tokenId: string): Promise<void> {
        try {
            const session = this.em.findOne(Session, { tokenId });

            await this.em.removeAndFlush(session)
            return
        } catch (err) {
            throw err
        }
    }

    async isValidate(tokenId: string): Promise<boolean> {
        try {
            const session = await this.em.findOne(Session, { tokenId });
            if (!session || session.exp < Date.now()) {
                return false
            }
            return true;
        } catch (err) {
            throw err
        }

    }
}