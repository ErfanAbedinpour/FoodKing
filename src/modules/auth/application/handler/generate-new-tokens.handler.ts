import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateNewTokensCommand } from '../command/generate-new-tokens.command';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { UserSessionRepository } from '../../repository/abstract/user-session.repository';
import { IRefreshTokenPayload } from '../interfaces/accessTokenPayload';
import {
  BadRequestException,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorMessage } from '../../../../ErrorMessages/Error.enum';
import { UserService } from '../../../users/user.service';
import { GenerateUserTokenCommand } from '../command/generate-user-token.command';

@CommandHandler(GenerateNewTokensCommand)
export class GenerateNewTokensHandler
  implements
    ICommandHandler<
      GenerateNewTokensCommand,
      { accessToken: string; refreshToken: string }
    >
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionRepo: UserSessionRepository,
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  private readonly logger = new Logger(GenerateNewTokensHandler.name);

  async execute(
    command: GenerateNewTokensCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const tokenPayload =
        await this.jwtService.verifyAsync<IRefreshTokenPayload>(
          command.refreshToken,
          { secret: process.env.REFRESH_TOKEN_SECRET },
        );

      const isValid = await this.sessionRepo.isValidate(tokenPayload.tokenId);

      if (!isValid)
        throw new UnauthorizedException(ErrorMessage.INVALID_REFRESH_TOKEN);

      await this.sessionRepo.invalidate(tokenPayload.tokenId);

      const user = await this.userService.findById(tokenPayload.userId);

      if (!user) throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);

      return this.commandBus.execute(
        new GenerateUserTokenCommand(
          +user.id.toString(),
          user.name,
          user.role.name,
        ),
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;

      if (err instanceof JsonWebTokenError)
        throw new UnauthorizedException(ErrorMessage.INVALID_REFRESH_TOKEN);
      this.logger.error(err);
      throw err;
    }
  }
}
