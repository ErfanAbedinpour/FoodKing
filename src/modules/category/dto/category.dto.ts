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

    @ApiProperty({readOnly:true,description:"Created at"})
    createdAt:Date

    @ApiProperty({readOnly:true,description:"Updated at"})
    updatedAt:Date

    @ApiProperty({readOnly:true,description:"User ID"})
    user:number
}