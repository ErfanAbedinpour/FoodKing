import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetUser } from '../common/decorator/getUser.decorator';
import { IsAuth } from '../common/decorator/auth.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CategoryDTO } from './dto/category.dto';
import { RoleAccess } from '../common/decorator/role-access.decorator';
import { UserRole } from '../../models';

@Controller('categories')
@IsAuth()
@ApiBearerAuth("JWT-AUTH")
@RoleAccess(UserRole.Owner)
@ApiUnauthorizedResponse({description: 'Unauthorized'})
@ApiForbiddenResponse({description: 'Forbidden'})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOkResponse({description: 'Category created successfully',type:CategoryDTO})
  @ApiBadRequestResponse({description: 'Category slug is invalid'})
  @ApiBody({type:CreateCategoryDto})
  @ApiOperation({summary: 'Create a new category'})
  async create(@Body() createCategoryDto: CreateCategoryDto,@GetUser("userId") userId:number) {
    return this.categoryService.create(createCategoryDto,userId);
  }

  @Get()
  @ApiOkResponse({description: 'Categories retrieved successfully',type:[CategoryDTO]})
  @ApiOperation({summary: 'Get all categories'})
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({description: 'Category retrieved successfully',type:CategoryDTO})
  @ApiNotFoundResponse({description: 'Category not found'})
  @ApiOperation({summary: 'Get a category by id'})
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({description: 'Category updated successfully',type:CategoryDTO})
  @ApiNotFoundResponse({description: 'Category not found'})
  @ApiBadRequestResponse({description: 'Category slug is invalid'})
  @ApiBody({type:UpdateCategoryDto})
  @ApiOperation({summary: 'Update a category'})
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({description: 'Category deleted successfully',schema:{
    properties:{msg:{type:'string'}}
  }})
  @ApiNotFoundResponse({description: 'Category not found'})
  @ApiOperation({summary: 'Delete a category'})
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
} 