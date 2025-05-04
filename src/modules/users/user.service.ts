import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserPersist } from './repository/user-persistance/user-persistrance';
import { RepositoryException } from './repository/exception/repository.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly logger = new Logger(UserService.name);

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async findByPhone(phone: string) {
    return this.userRepository.findByPhone(phone);
  }

  async createUser(user: UserPersist) {
    try {
      return this.userRepository.create(user);
    } catch (err) {
      if (err instanceof RepositoryException)
        throw new BadRequestException(err.message);

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
