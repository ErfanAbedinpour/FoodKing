import { Command } from '@nestjs/cqrs';

export class GenerateNewTokensCommand extends Command<{
  accessToken: string;
  refreshToken: string;
}> {
  constructor(public readonly refreshToken: string) {
    super();
  }
}
