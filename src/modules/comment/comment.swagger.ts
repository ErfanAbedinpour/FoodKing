import {applyDecorators} from '@nestjs/common'
import {ApiBody,ApiCreatedResponse, ApiOkResponse, ApiOperation} from '@nestjs/swagger'
import {CreateCommentDto} from './dtos/create-comment.dto'
import { CommentDto } from './dtos/comment.dto'

export function CreateCommentSwaggerConfiguration(){
	return applyDecorators(
		ApiBody({type:CreateCommentDto}),
		ApiOkResponse({description:"Comment Created",type:CommentDto}),
		ApiOperation({summary:"Create Comment"})
	)
}
