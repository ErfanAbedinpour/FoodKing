import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, isString, IsString, IsTaxId } from "class-validator";
import Decimal from "decimal.js";
import {ApiProperty} from '@nestjs/swagger'

export class CreateProductDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name:string


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    slug:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    en_name:string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    inventory:number


    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({},{each: true})
    categories:number[]

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(()=>Decimal)
    price:Decimal

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description:string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    restaurant_id:number
}