import { ApiProperty } from "@nestjs/swagger"
import { type } from "os"
import { ProductDTO } from "src/modules/product/dto/product.dto"

export class CommentDto{
	@ApiProperty()
	id:number
	@ApiProperty()
	body:string
	@ApiProperty()
	rating:number
	@ApiProperty()
	createdAt:string
	@ApiProperty()
	updatedAt:string
	@ApiProperty()
	user:number
	@ApiProperty()
	productId:number
}
