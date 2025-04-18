import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
    abstract findByPhone(phone: string): Promise<UserEntity | null>
    abstract create(user: UserEntity): Promise<void>
    abstract findById(id: number): Promise<UserEntity | null>
    abstract update(id: number, user: Partial<UserEntity>): Promise<UserEntity>
    abstract delete(id: number): Promise<void>
}