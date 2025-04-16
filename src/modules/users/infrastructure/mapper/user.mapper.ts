import { User } from '@models/index'
import { UserEntity } from '../../domain/entities/user.entity'

export class UserMapper {
    static toDomain(user: User): UserEntity {
        return UserEntity.reCreate(user.id, user.name, user.email, user.phone_number, user.password, user.role.name);
    }


    static toPersist(userEntity: UserEntity): User {
        const user = new User();
        user.name = userEntity.name
        user.email = userEntity.email.value
        user.phone_number = userEntity.phone_number.value
        return user;
    }

}