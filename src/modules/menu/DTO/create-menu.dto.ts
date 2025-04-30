import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSubMenuDTO } from './create-sub-menu.dto';
import { Type } from 'class-transformer';

export class CreateMenuDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  en_title: string;

  @ApiProperty({ type: [CreateSubMenuDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateSubMenuDTO)
  sub_menu: CreateSubMenuDTO[];
}
