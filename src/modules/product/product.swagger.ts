import { applyDecorators } from "@nestjs/common";
import { 
    ApiBearerAuth, 
    ApiBody, 
    ApiConsumes, 
    ApiCreatedResponse, 
    ApiNotFoundResponse, 
    ApiOkResponse, 
    ApiOperation, 
    ApiParam, 
    ApiProperty, 
    ApiResponse, 
    ApiBadRequestResponse,
    getSchemaPath 
} from "@nestjs/swagger";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ProductDTO } from "./dto/product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "@models/product.model";

export function CreateProductSwagger() {
    return applyDecorators(
        ApiBearerAuth('JWT-AUTH'),
        ApiOperation({ summary: 'Create a new product' }),
        ApiCreatedResponse({
            description: 'Product successfully created',
            type: ProductDTO
        }),
        ApiBadRequestResponse({
            description: 'Invalid input data or file upload error'
        }),
        ApiBody({
            schema: {
                allOf: [
                    {
                        $ref: getSchemaPath(CreateProductDTO),
                    },
                    {
                        properties: {
                            image: { type: 'string', format: 'binary' },
                        },
                    },
                ],
            },
        }),
        ApiConsumes('multipart/form-data')
    )
}

export function GetProductBySlug() {
    return applyDecorators(
        ApiOperation({ summary: 'Get a product by slug' }),
        ApiOkResponse({
            description: 'Product found',
            type: ProductDTO,
        }),
        ApiNotFoundResponse({
            description: 'Product not found',
        }),
        ApiParam({ name: 'slug', type: 'string', description: 'Product Slug' })
    )
}

export function GetAllProductsSwagger() {
    return applyDecorators(
        ApiOperation({ summary: 'Get all products' }),
        ApiOkResponse({ 
            description: 'List of all products', 
            type: [ProductDTO] 
        })
    )
}

export function UpdateProductSwagger() {
    return applyDecorators(
        ApiBearerAuth('JWT-AUTH'),
        ApiOperation({ summary: 'Update a product' }),
        ApiResponse({
            status: 200,
            description: 'Product successfully updated',
            type: Product,
        }),
        ApiNotFoundResponse({ 
            description: 'Product not found' 
        }),
        ApiBadRequestResponse({
            description: 'Invalid input data'
        }),
        ApiParam({ 
            name: 'id', 
            type: 'number', 
            description: 'Product ID' 
        }),
        ApiBody({ 
            type: UpdateProductDto 
        })
    )
}

export function DeleteProductSwagger() {
    return applyDecorators(
        ApiBearerAuth('JWT-AUTH'),
        ApiOperation({ summary: 'Delete a product' }),
        ApiResponse({
            status: 200,
            description: 'Product successfully deleted',
            type: Product,
        }),
        ApiNotFoundResponse({ 
            description: 'Product not found' 
        }),
        ApiParam({ 
            name: 'id', 
            type: 'number', 
            description: 'Product ID' 
        })
    )
}

export function UpdateInventorySwagger() {
    return applyDecorators(
        ApiBearerAuth('JWT-AUTH'),
        ApiOperation({ summary: 'Update product inventory' }),
        ApiOkResponse({
            description: 'Inventory successfully updated',
            type: ProductDTO,
        }),
        ApiNotFoundResponse({ 
            description: 'Product not found' 
        }),
        ApiBadRequestResponse({ 
            description: 'Insufficient inventory' 
        }),
        ApiBody({
            schema: {
                properties: { 
                    quantity: { type: 'number' } 
                },
                required: ['quantity'],
            },
        }),
        ApiParam({ 
            name: 'id', 
            type: 'number', 
            description: 'Product ID' 
        })
    )
}

export function ToggleProductStatusSwagger() {
    return applyDecorators(
        ApiBearerAuth('JWT-AUTH'),
        ApiOperation({ summary: 'Toggle product active status' }),
        ApiResponse({
            status: 200,
            description: 'Status successfully toggled',
            type: ProductDTO,
        }),
        ApiNotFoundResponse({ 
            description: 'Product not found' 
        }),
        ApiParam({ 
            name: 'id', 
            type: 'number', 
            description: 'Product ID' 
        })
    )
}
