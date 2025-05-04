import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class GenerateTokenDTO {
  @ApiProperty()
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
