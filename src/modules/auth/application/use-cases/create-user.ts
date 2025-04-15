import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../../../auth/application/command/createUser.command";
import { UserRepository } from "../../../users/domain/repository/user.repository";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, void> {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async execute(command: CreateUserCommand): Promise<void> {
        const user = UserEntity.create(command.name, command.email, command.phone, command.password);
        try {

            const isPhoneExist = await this.userRepository.findByPhone(command.phone)
            if (isPhoneExist)
                throw new BadRequestException(ErrorMessage.PHONE_EXIST);

            await this.userRepository.create(user);
            // generate Token
            return
        } catch (err) {
            throw err;
        }
    }
}