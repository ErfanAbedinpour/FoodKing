import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common'
import {EntityManager} from '@mikro-orm/core'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { ProductService } from '../product/product.service'
import { Comment } from '@models/comment.model';
import { CommentDto } from './dtos/comment.dto';


@Injectable()
export class CommentService{
	private readonly logger = new Logger(CommentService.name)

	constructor(private readonly em:EntityManager,private readonly productService:ProductService){}

	async createComment(userID:number,{productId,body,rate}:CreateCommentDto){
		await this.productService.getProductById(productId);

		try{
			const comment = this.em.create(Comment,{body,rating:rate,product:productId,user:userID});
			await this.em.persistAndFlush(comment);
			return this.serializeCommentToDto(comment);
		}catch(err){
			this.logger.error(err);
			throw new InternalServerErrorException();
		}
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

	updateComment(id:number){}


	deleteComment(id:number){}


	getCommentById(id:number){}

}
