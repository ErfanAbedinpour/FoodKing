import {Controller,Post,Get,Patch,Delete, Body} from '@nestjs/common'
import { IsAuth } from '../common/decorator/auth.decorator';
import { GetUser } from '../common/decorator/getUser.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentService } from './comment.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comments')
@ApiBearerAuth("JWT-AUTH")
@IsAuth()
export class CommentController{

	constructor(private readonly commentService:CommentService){}

	@Post()
	createComment(@GetUser("userId") userID:number,@Body() createCommentBody:CreateCommentDto){
		return this.commentService.createComment(userID,createCommentBody)
	}


	@Get(":id")
	getCommentById(){}


	@Patch(":id")
	updateComment(){}


	@Delete(":id")
	deleteComment(){}

}
