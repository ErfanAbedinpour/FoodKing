import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/createUser.command";
import { BadRequestException, HttpException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { UserService } from "../../../users/user.service";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, void> {
    private readonly logger = new Logger(CreateUserHandler.name)

    constructor(
        private readonly userService: UserService,
    ) { }

    async execute(command: CreateUserCommand): Promise<void> {
        try {

            const isPhoneExist = await this.userService.findByPhone(command.phone)

            if (isPhoneExist)
                throw new BadRequestException(ErrorMessage.PHONE_EXIST);

            await this.userService.createUser({ email: command.email, name: command.name, password: command.password, phone_number: command.phone });
            return
        } catch (err) {
            if (err instanceof HttpException)
                throw err;
            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}