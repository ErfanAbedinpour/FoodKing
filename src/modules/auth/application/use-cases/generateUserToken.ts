import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserSessionRepository } from "../../domain/repository/user-session.repository";
import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IAccessTokenPayload } from "../interfaces/accessTokenPayload";
import { randomUUID } from "crypto";
import { GenerateUserTokenCommand } from "../command/generate-user-token.command";

@Injectable()
@CommandHandler(GenerateUserTokenCommand)
export class GenerateTokenUseCase implements ICommandHandler<GenerateUserTokenCommand> {
    constructor(private readonly sessionRepository: UserSessionRepository, private readonly jwt: JwtService) { }

    private readonly logger = new Logger(GenerateTokenUseCase.name);

    async execute({ name, role, userId }: GenerateUserTokenCommand): Promise<{ accessToken: string, refreshToken: string }> {

        const accessTokenPayload: IAccessTokenPayload = {
            name: name,
            userId: userId,
            role: role
        }

        try {
            const accessToken = await this.jwt.signAsync(accessTokenPayload, {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE + 'min'
            })

            const tokenId = randomUUID()

            const refreshToken = await this.jwt.signAsync({ ...accessTokenPayload, tokenId }, {
                secret: process.env.REFRESH_TOKEN_SECRET,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE + 'day'
            })

            await this.sessionRepository.create(userId, refreshToken, tokenId);

            return {
                accessToken,
                refreshToken
            }

        } catch (err) {
            this.logger.error(err)
            // console.error(err)
            throw err;
        }

    }
}