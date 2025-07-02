import { Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common'
import { IsAuth } from '../common/decorator/auth.decorator';
import { GetUser } from '../common/decorator/getUser.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentService } from './comment.service';
import { CreateCommentSwaggerConfiguration, DeleteCommentSwaggerConfiguration, GetCommentSwaggerConfiguration, UpdateCommentSwaggerConfiguration } from './comment.swagger';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { UserRole } from '@models/role.model';

@Controller('comments')
export class CommentController {

	constructor(private readonly commentService: CommentService) { }

	@Post()
	@CreateCommentSwaggerConfiguration()
	@IsAuth()
	createComment(@GetUser("userId") userID: number, @Body() createCommentBody: CreateCommentDto) {
		return this.commentService.createComment(userID, createCommentBody)
	}

	@Get(":id")
	@GetCommentSwaggerConfiguration()
	getCommentById(@Param("id", ParseIntPipe) commentId: number) {
		return this.commentService.getCommentById(commentId)
	}


	@Patch(":id")
	@IsAuth()
	@UpdateCommentSwaggerConfiguration()
	updateComment(@Param('id', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto, @GetUser("userId") userId: number) {
		return this.commentService.updateComment(commentId, updateCommentDto, userId);
	}


	@Delete(":id")
	@IsAuth()
	@DeleteCommentSwaggerConfiguration()
	deleteComment(@Param("id", ParseIntPipe) commentId: number, @GetUser() user: { role: UserRole, userId: number }) {
		return this.commentService.deleteComment(commentId, user.userId, user.role)
	}

}
