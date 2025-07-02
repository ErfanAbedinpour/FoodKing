import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateCommentDto{
	@ApiProperty({example:2,minimum:0,maximum:5,required:false})
	@IsNumber()
	@Min(1)
	@Max(5)
	rate:number = 0

	@ApiProperty({example:2,required:true,description:"ProductID"})
	@IsNotEmpty()
	@IsNumber()
	productId:number


	@ApiProperty({example:2,required:true,description:"Content Of Comment"})
	@IsString()
	@IsNotEmpty()
	body:string
}
