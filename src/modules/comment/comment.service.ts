import {Injectable} from '@nestjs/common'
import {EntityManager} from '@mikro-orm/core'


@Injectable()
export class CommentService{
	constructor(private readonly em:EntityManager){}


	createComment(){}


	updateComment(id:number){}


	deleteComment(id:number){}


	getCommentById(id:number){}

}
