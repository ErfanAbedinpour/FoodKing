import {Module} from '@nestjs/common';
import {CommentController} from './comment.controller';
import {CommentService} from './comment.service';
import { ProductModule } from '../product/product.module';


@Module({
	imports:[ProductModule],
	providers:[CommentService],
	controllers:[CommentController]
})
export class CommentModule{}
