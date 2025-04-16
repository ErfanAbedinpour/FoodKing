import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../../../auth/application/command/createUser.command";
import { UserRepository } from "../../../users/domain/repository/user.repository";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, void> {
    private readonly logger = new Logger(CreateUserUseCase.name)
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
            return
        } catch (err) {
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}