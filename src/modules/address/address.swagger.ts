import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateAddressDto } from "./dto/create-address.dto";
import { AddressDto } from "./dto/address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

export function CreateAddressSwagger() {
    return applyDecorators(
        ApiBody({type:CreateAddressDto}),
        ApiCreatedResponse({type:AddressDto})
    )
}


export function GetOneAddressSwagger(){
    return applyDecorators(
        ApiParam({name:"id",type:"number",description:"Address id"}),
        ApiOkResponse({type:AddressDto})
    )
}


export function GetAllAddressSwagger(){
    return applyDecorators(
        ApiOkResponse({type:[AddressDto]})
    )
}


export function UpdateAddressSwagger(){
    return applyDecorators(
        ApiParam({name:"id",type:"number",description:"Address id"}),
        ApiBody({type:UpdateAddressDto}),
        ApiOkResponse({type:AddressDto})
    )
}

export function RemoveAddressSwagger(){
    return applyDecorators(
        ApiParam({name:"id",type:"number",description:"Address id"}),
        ApiOkResponse({type:Boolean})
    )
}


    

