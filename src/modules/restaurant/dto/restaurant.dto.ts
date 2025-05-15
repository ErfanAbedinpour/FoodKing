import { ApiProperty } from "@nestjs/swagger"
import { ProductDTO } from "../../product/dto/product.dto"

export class RestaurantDTO{
    @ApiProperty()
    name:string

    @ApiProperty()
    en_name:string

    @ApiProperty()
    ownerId:number

    @ApiProperty({type:[ProductDTO]})
    products:ProductDTO[]
}