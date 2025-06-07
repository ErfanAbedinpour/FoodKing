import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, getSchemaPath } from "@nestjs/swagger";
import { CartDTO } from "./dto/cart.dto";

export function GetUserCartSwagger(){
    return applyDecorators(
        ApiOkResponse({
            description: 'User cart',
            schema: {
              properties: {
                data: {
                  type: 'array',
                  items: { type: 'object', $ref: getSchemaPath(CartDTO) },
                },
                totalPrice: { type: 'number' },
              },
            },
          }),
          ApiNotFoundResponse({
            description: 'Cart is empty',
          })
    )
}



export function AddItemToCartSwagger(){
    return applyDecorators(
      ApiOperation({summary:'Add item to cart'}),
        ApiOkResponse({
            description: 'Item added to cart',
            type: CartDTO,
          }),
          ApiBadRequestResponse({
            description: 'Product not found',
          })
    )
}



export function ClearCartSwagger(){
    return applyDecorators(
      ApiOperation({summary:'Clear cart'}),
        ApiOkResponse({
            description: 'Cart cleared',
            schema: { properties: { msg: { type: 'string' } } },
          }),
          ApiNotFoundResponse({
            description: 'Cart not found',
          })
    )
}
    


export function RemoveItemFromCartSwagger(){
    return applyDecorators(
      ApiOperation({summary: 'Remove item from cart'}),
        ApiOkResponse({
            description: 'Item removed from cart',
            schema: { properties: { msg: { type: 'string' } } },
          }),
          ApiBadRequestResponse({
            description: 'Product not found',
          })
    )
}
 