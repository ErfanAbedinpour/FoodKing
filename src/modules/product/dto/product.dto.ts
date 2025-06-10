import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../models';
import { CategoryDTO } from '../../category/dto/category.dto';

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
  slug:string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  category: object[];

  @ApiProperty()
  attributes: object[];

  @ApiProperty()
  restaurant: number | null;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({required:false})
  image?: string | null;


  @ApiProperty()
  createdAt:string;
}
