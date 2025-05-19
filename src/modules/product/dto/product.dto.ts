import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  inventory: number;

  @ApiProperty()
  price: string;

  @ApiProperty()
  category: object[];

  @ApiProperty()
  attributes: object[];

  @ApiProperty()
  restaurant_id: number;

  @ApiProperty()
  isActivate: boolean;

  @ApiProperty()
  image: string;
}
