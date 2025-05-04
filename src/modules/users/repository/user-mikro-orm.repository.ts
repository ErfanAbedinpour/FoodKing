import { EntityManager, NotFoundError, wrap } from '@mikro-orm/postgresql';
import { Role, User, UserRole } from '@models/index';
import { Injectable } from '@nestjs/common';
import { ErrorMessage } from '../../../ErrorMessages/Error.enum';
import { UserRepository } from './user.repository';
import { UserPersist } from './user-persistance/user-persistrance';
import { RepositoryException } from './exception/repository.exception';

@Injectable()
export class MikroUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async create({
    email,
    name,
    password,
    phone_number,
    role,
  }: UserPersist): Promise<void> {
    try {
      const userRole = await this.em.findOne(Role, {
        name: role || UserRole.Customer,
      });

      if (!userRole) throw new RepositoryException(ErrorMessage.ROLE_NOT_FOUND);

      const user = this.em.create(User, {
        email: email,
        name,
        password,
        phone_number: phone_number,
        role: userRole,
        is_active: true,
        cart: {},
      });
      await this.em.persistAndFlush(user);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.em.findOne(User, id);

    if (!user) throw new RepositoryException(ErrorMessage.ROLE_NOT_FOUND);

    try {
      await this.em.removeAndFlush(user);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return this.em.findOne(User, id, { populate: ['role.name'] });
    } catch (err) {
      throw err;
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      return this.em.findOne(
        User,
        { phone_number: phone },
        { populate: ['role'] },
      );
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, user: Partial<UserPersist>): Promise<User> {
    try {
      const targetUser = await this.em.findOneOrFail(User, id, {
        populate: ['role'],
      });
      const updatedUser = wrap(targetUser).assign(user as any);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }
}
