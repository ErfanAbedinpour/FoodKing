import {Controller,Post,Get,Patch,Delete} from '@nestjs/common'

@Controller('comments')
export class CommentController{

	constructor(){}

	@Post()
	createComment(){}


	@Get(":id")
	getCommentById(){}


	@Patch(":id")
	updateComment(){}


	@Delete(":id")
	deleteComment(){}

}
