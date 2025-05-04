import { User } from '@models/user.model';
import { UserPersist } from './user-persistance/user-persistrance';

export abstract class UserRepository {
  abstract findByPhone(phone: string): Promise<User | null>;
  abstract create(user: UserPersist): Promise<void>;
  abstract findById(id: number): Promise<User | null>;
  abstract update(id: number, user: Partial<UserPersist>): Promise<User>;
  abstract delete(id: number): Promise<boolean>;
}
