import { ApiProperty } from '@nestjs/swagger';

export class SubMenuDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: number;
  @ApiProperty()
  updatedAt: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  slug: string;
  @ApiProperty()
  en_title: string;
}
