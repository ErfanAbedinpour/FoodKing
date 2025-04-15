import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands/createUser.command";
import { UserRepository } from "../../domain/repository/user.repository";

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, void> {
    constructor(
        private readonly userRepository:UserRepository
    ){}

    async execute(command: CreateUserCommand): Promise<void> {
        return ;
    }

}