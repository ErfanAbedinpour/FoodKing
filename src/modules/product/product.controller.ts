import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Product } from '@models/product.model';
import { ProductDTO } from './dto/product.dto';
import { GetUser } from '../common/decorator/getUser.decorator';
import { IsAuth } from '../common/decorator/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { 
  CreateProductSwagger, 
  GetProductBySlug, 
  GetAllProductsSwagger, 
  UpdateProductSwagger, 
  DeleteProductSwagger, 
  UpdateInventorySwagger, 
  ToggleProductStatusSwagger 
} from './product.swagger';

@ApiTags('products')
@Controller('products')
@ApiExtraModels(CreateProductDTO)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @IsAuth()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @CreateProductSwagger()
  async create(
    @Body() createProductDto: CreateProductDTO,
    @GetUser('userId') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'file must be lower than 5Mb',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.productService.createProduct(createProductDto, userId, image);
  }

  @Get(':slug')
  @GetProductBySlug()
  async findBySlug(@Param('slug') slug: string): Promise<ProductDTO> {
    return this.productService.getProductBySlug(slug);
  }

  @Get()
  @GetAllProductsSwagger()
  getProducts() {
    return this.productService.getAllProduct();
  }

  @Patch(':id')
  @IsAuth()
  @UpdateProductSwagger()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDTO> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @IsAuth()
  @DeleteProductSwagger()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ProductDTO> {
    return this.productService.deleteProduct(id);
  }

  @Patch(':id/inventory')
  @IsAuth()
  @UpdateInventorySwagger()
  async updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<ProductDTO> {
    return this.productService.updateInventory(id, quantity);
  }

  @Patch(':id/toggle-status')
  @IsAuth()
  @ToggleProductStatusSwagger()
  async toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<ProductDTO> {
    return this.productService.toggleProductStatus(id);
  }
}
