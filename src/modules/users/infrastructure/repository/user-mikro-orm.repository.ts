import { EntityManager, NotFoundError, wrap } from "@mikro-orm/postgresql";
import { UserRepository } from "../../domain/repository/user.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserMapper } from "../mapper/user.mapper";
import { Role, User } from '@models/index'
import { Injectable } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { RoleNotFound, UserNotFound } from "../../domain/errors";

@Injectable()
export class MikroUserRepository implements UserRepository {
    constructor(private readonly em: EntityManager) { }

    async create({ email, name, password, phone_number, role }: UserEntity): Promise<void> {
        try {

            const userRole = await this.em.findOne(Role, { name: role.value });
            if (!userRole)
                throw new RoleNotFound(ErrorMessage.ROLE_NOT_FOUND)

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
            throw err
        }
    }


    async delete(id: number): Promise<void> {
        const user = await this.em.findOne(User, id);
        if (!user)
            throw new UserNotFound(ErrorMessage.ROLE_NOT_FOUND)
        try {
            await this.em.removeAndFlush(user);
        } catch (err) {
            throw err
        }
    }

    async findById(id: number): Promise<UserEntity> {
        try {
            const user = ((await this.em.findOne(User, id, { fields: ["role.name"] })) as User);
            if (!user)
                return user
            return UserMapper.toDomain(user)
        } catch (err) {
            throw err
        }
    }

    async findByPhone(phone: string): Promise<UserEntity> {
        try {
            const user = ((await this.em.findOne(User, { phone_number: phone }, { fields: ["role.name"] })) as User);
            if (!user)
                return user
            return UserMapper.toDomain(user)
        } catch (err) {
            if (err instanceof NotFoundError)
                throw new UserNotFound(ErrorMessage.USER_NOT_FOUND)
            throw err
        }
    }


    async update(id: number, user: Partial<UserEntity>): Promise<UserEntity> {
        try {
            const u = UserMapper.toDomain((await this.em.findOneOrFail(User, id, { fields: ["role.name"] })) as User);
            const newUser = wrap(u).assign(user)
            return UserMapper.toDomain(newUser as unknown as User);
        } catch (err) {
            if (err instanceof NotFoundError)
                throw new UserNotFound(ErrorMessage.USER_NOT_FOUND)
            throw err
        }
    }
}