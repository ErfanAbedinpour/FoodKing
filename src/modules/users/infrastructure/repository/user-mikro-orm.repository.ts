import { EntityManager, NotFoundError, wrap } from "@mikro-orm/postgresql";
import { UserRepository } from "../../domain/repository/user.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserMapper } from "../mapper/user.mapper";
import { Role, User } from '@models/index'
import { Injectable } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";

@Injectable()
export class MikroUserRepository implements UserRepository {
    constructor(private readonly em: EntityManager) { }

    async create({ email, name, password, phone_number, role }: UserEntity): Promise<void> {
        try {

            const userRole = await this.em.findOneOrFail(Role, { name: role.value });

            const user = this.em.create(User, {
                email: email.value,
                name,
                password,
                phone_number: phone_number.value,
                role: userRole,
                is_active: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                cart: {}
            })
            await this.em.persistAndFlush(user)
            return

        } catch (err) {
            if (err instanceof NotFoundError)
                throw new Error(ErrorMessage.ROLE_NOT_FOUNd)
            throw err
        }
    }


    async delete(id: number): Promise<void> {
        const user = this.em.getReference(User, id);
        try {
            await this.em.removeAndFlush(user);
        } catch (err) {
            throw err
        }
    }

    async findById(id: number): Promise<UserEntity> {
        try {
            const user = UserMapper.toDomain((await this.em.findOneOrFail(User, id, { fields: ["role.name"] })) as User);
            return user
        } catch (err) {
            throw err
        }
    }

    async findByPhone(phone: string): Promise<UserEntity> {
        try {
            const user = UserMapper.toDomain((await this.em.findOneOrFail(User, { phone_number: phone }, { fields: ["role.name"] })) as User);
            return user
        } catch (err) {
            throw err
        }
    }


    async update(id: number, user: Partial<UserEntity>): Promise<UserEntity> {
        try {
            const u = UserMapper.toDomain((await this.em.findOneOrFail(User, id, { fields: ["role.name"] })) as User);
            const newUser = wrap(u).assign(user)
            return UserMapper.toDomain(newUser as unknown as User);
        } catch (err) {
            throw err
        }
    }
}