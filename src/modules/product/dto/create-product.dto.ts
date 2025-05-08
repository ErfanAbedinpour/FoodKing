import { Type } from "class-transformer";
import {  IsNotEmpty, IsNumber, IsNumberString,  IsString} from "class-validator";
import Decimal from "decimal.js";
import {ApiProperty} from '@nestjs/swagger'

export class CreateProductDTO{
    @ApiProperty({example:"burger"})
    @IsNotEmpty()
    @IsString()
    name:string


    @ApiProperty({example:"burger"})
    @IsNotEmpty()
    @IsString()
    slug:string

    @ApiProperty({example:5})
    @IsNotEmpty()
    @IsNumber()
    inventory:number


    @ApiProperty({type:[Number],example:[1,2,3]})
    @IsNotEmpty()
    @IsNumber({},{each: true})
    categories:number[]

    @ApiProperty({type:'string',example:"1200000"})
    @IsNumberString()
    @IsNotEmpty()
    @Type(()=>Decimal)
    price:Decimal

    @ApiProperty({description:"This burger was created with the best materials. The taste is perfect!"})
    @IsNotEmpty()
    @IsString()
    description:string

    @ApiProperty({example:1})
    @IsNumber()
    @IsNotEmpty()
    restaurant_id:number
}