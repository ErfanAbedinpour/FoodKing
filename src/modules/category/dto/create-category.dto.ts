import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty({})
  @IsString()
  en_name: string;

  @ApiProperty({required:true})
  @IsNotEmpty()
  @IsString()
  slug:string

  @ApiProperty({required:false})
  @IsBoolean()
  @IsOptional()
  isActivate?: boolean;
} 