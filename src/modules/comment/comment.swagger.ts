import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { CommentDto } from './dtos/comment.dto'
import { UpdateCommentDto } from './dtos/update-comment.dto'

export function CreateCommentSwaggerConfiguration() {
	return applyDecorators(
		ApiBody({ type: CreateCommentDto }),
		ApiOkResponse({ description: "Comment Created", type: CommentDto }),
		ApiBearerAuth("JWT-AUTH"),
		ApiOperation({ summary: "Create Comment" })
	)
}

export function UpdateCommentSwaggerConfiguration() {
	return applyDecorators(
		ApiBody({ type: UpdateCommentDto }),
		ApiOkResponse({ description: "Comment Updated", type: CommentDto }),
		ApiBearerAuth("JWT-AUTH"),
		ApiOperation({ summary: "Update Comment" })
	)
}


export function DeleteCommentSwaggerConfiguration() {
	return applyDecorators(
		ApiBearerAuth("JWT-AUTH"),
		ApiOperation({ summary: "Delete Comment" }),
		ApiOkResponse({ description: "Comment Deleted" })
	)
}

export function GetCommentSwaggerConfiguration() {
	return applyDecorators(
		ApiBearerAuth("JWT-AUTH"),
		ApiOperation({ summary: "Get Comment" }),
		ApiOkResponse({ description: "Comment Found", type: CommentDto })
	)
}