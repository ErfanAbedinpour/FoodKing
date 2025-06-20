import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common'
import {EntityManager} from '@mikro-orm/core'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { ProductService } from '../product/product.service'
import { Comment } from '@models/comment.model';


@Injectable()
export class CommentService{
	private readonly logger = new Logger(CommentService.name)

	constructor(private readonly em:EntityManager,private readonly productService:ProductService){}

	async createComment(userID:number,{productId,body,rate}:CreateCommentDto){
		const product = await this.productService.getProductById(productId);

		const comment = this.em.create(Comment,{body,rating:rate,product,user:userID});

		try{
			await this.em.persistAndFlush(comment);
			return comment;
		}catch(err){
			this.logger.error(err);
			throw new InternalServerErrorException();
		}
	}


	updateComment(id:number){}


	deleteComment(id:number){}


	getCommentById(id:number){}

}
