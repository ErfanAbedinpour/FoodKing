import { Role, User } from '@models/index'
import { UserEntity } from '../../domain/entities/user.entity'
import { Email } from '../../domain/value-object/email.vo';

export class UserMapper {
    static toDomain(user: User): UserEntity {
        return UserEntity.create(user.name, user.email, user.phone_number, user.password, user.role.name);
    }


    static toPersist(userEntity: UserEntity): User {
        const user = new User();
        user.name = userEntity.name
        user.email = userEntity.email.value
        user.phone_number = userEntity.phone_number.value
        return user;
    }

}