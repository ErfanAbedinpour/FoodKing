import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProductDTO } from '../../product/dto/product.dto';

export class CartDTO {
  @ApiProperty({})
  cart: number;

  @ApiProperty({ type: OmitType(ProductDTO, ['attributes', 'category']) })
  product: Omit<ProductDTO, 'attributes' | 'category'>;

  @ApiProperty({})
  count: number;
}
