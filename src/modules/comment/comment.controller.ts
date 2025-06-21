import {Controller,Post,Get,Patch,Delete, Body} from '@nestjs/common'
import { IsAuth } from '../common/decorator/auth.decorator';
import { GetUser } from '../common/decorator/getUser.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentService } from './comment.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentSwaggerConfiguration } from './comment.swagger';
import { CommentDto } from './dtos/comment.dto';
import { Comment } from '@models/comment.model';

@Controller('comments')
@ApiBearerAuth("JWT-AUTH")
@IsAuth()
export class CommentController{

	constructor(private readonly commentService:CommentService){}

	@Post()
	@CreateCommentSwaggerConfiguration()
	createComment(@GetUser("userId") userID:number,@Body() createCommentBody:CreateCommentDto){
		return this.commentService.createComment(userID,createCommentBody)
	}


	private serializeCommentToDto(comment:Comment):CommentDto{
		return {
			productId:comment.product.id,
			id:comment.id,
			user:comment.user.id,
			rating:comment.rating,
			body:comment.body,
			createdAt:comment.createdAt?.toString() || Date.now().toString(),
			updatedAt:comment.updatedAt?.toString() || Date.now().toString()
		}
	}

	@Get(":id")
	getCommentById(){}


	@Patch(":id")
	updateComment(){}


	@Delete(":id")
	deleteComment(){}

}
