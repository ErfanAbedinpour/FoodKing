import { ApiProperty } from '@nestjs/swagger';

export class MenuDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({ description: 'Created Unix Timestamp' })
  createdAt: number;
  @ApiProperty({ description: 'last Updated Unix Timestamp' })
  updatedAt: number;
  @ApiProperty()
  en_title: string;
}
