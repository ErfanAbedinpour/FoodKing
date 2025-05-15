import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsTaxId } from "class-validator"

export class CategoryDTO{
    @ApiProperty()
    slug:string

    @ApiProperty()
    name:string


    @ApiProperty()
    en_name:string


    @ApiProperty()
    isActivate:boolean


    @ApiProperty()
    userId:number
}