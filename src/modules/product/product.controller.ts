import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Product } from '@models/product.model';
import { ProductDTO } from './dto/product.dto';
import { GetUser } from '../common/decorator/getUser.decorator';
import { IsAuth } from '../common/decorator/auth.decorator';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth("JWT-AUTH")
@IsAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ description: 'Product successfully created', type: ProductDTO})
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDTO,@GetUser("userId") userId:number): Promise<Product> {
    return this.productService.createProduct(createProductDto,userId);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a product by slug' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string): Promise<Product> {
    return this.productService.getProductBySlug(slug);
  }


  @Get()
  @ApiOperation({summary:"Get Products List"})
  @ApiOkResponse({description:"Get a products",type:[ProductDTO]})
  getProducts(){
    return this.productService.getAllProduct();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product successfully updated', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.deleteProduct(id);
  }

  @Patch(':id/inventory')
  @ApiOperation({ summary: 'Update product inventory' })
  @ApiResponse({ status: 200, description: 'Inventory successfully updated', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Insufficient inventory' })
  async updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<Product> {
    return this.productService.updateInventory(id, quantity);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle product active status' })
  @ApiResponse({ status: 200, description: 'Status successfully toggled', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.toggleProductStatus(id);
  }
}