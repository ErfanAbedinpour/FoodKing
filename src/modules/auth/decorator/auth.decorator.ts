import { SetMetadata } from '@nestjs/common';

export const AuthToken = 'IsAuth';

export const IsAuth = () => SetMetadata(AuthToken, true);
