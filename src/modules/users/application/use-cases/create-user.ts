import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands/createUser.command";
import { UserRepository } from "../../domain/repository/user.repository";
import { UserEntity } from "../../domain/entities/user.entity";

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, void> {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(command: CreateUserCommand): Promise<void> {
        const user = UserEntity.create(command.name, command.email, command.role, command.phone, command.password);
        try {
            await this.userRepository.create(user);
            return
        } catch (err) {
            throw err;
        }
    }
}