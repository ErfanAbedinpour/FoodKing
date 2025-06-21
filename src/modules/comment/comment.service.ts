import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common'
import {EntityManager, NotFoundError, wrap} from '@mikro-orm/core'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { ProductService } from '../product/product.service'
import { Comment } from '@models/comment.model';
import { CommentDto } from './dtos/comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';
import { UserRole } from '@models/role.model';


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

	async updateComment(id:number,{rate,body}:UpdateCommentDto,userId:number){
		try{
			const targetComment = await this.em.findOneOrFail(Comment,{$and:[{id},{user:userId}]});
			const commnet = wrap(targetComment).assign({rating:rate,body})
			return commnet;
		}catch(err){
			if(err instanceof NotFoundError){
				throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
			}
			this.logger.error(err)
			throw new InternalServerErrorException()
		}

	}


	async deleteComment(id:number,userId:number,userRole:UserRole){
		try{
			const targetComment = await this.em.findOneOrFail(Comment,id);
			
			 if(targetComment.user.id!==userId || userRole!==UserRole.Owner)
				throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
			
			 await this.em.removeAndFlush(targetComment)
			return true;
		}catch(err){
			if(err instanceof HttpException)
				throw err
			else if(err instanceof NotFoundError)
				throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
			
			this.logger.error(err)
			throw new InternalServerErrorException()
		}


	}


	async getCommentById(id:number){
		try{
			const targetComment = await this.em.findOneOrFail(Comment,id,{populate:['user']});

			return targetComment
		}catch(err){
			if(err instanceof NotFoundError){
				throw new NotFoundException(ErrorMessage.COMMENT_NOT_FOUND)
			}
			this.logger.error(err)
			throw new InternalServerErrorException()
		}
	}

}
