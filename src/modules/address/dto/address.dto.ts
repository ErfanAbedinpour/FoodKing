import {  ApiProperty } from "@nestjs/swagger";

export class AddressDto{

    @ApiProperty({description:"AddressId",example:1})
    id:number

    @ApiProperty({description:"Address Zip Code",example:"12345"})
    zip_code:string

    @ApiProperty({description:"Address Street",example:"123 Main St"})
    street:string

    @ApiProperty({description:"Address City",example:"New York"})
    city:string

    @ApiProperty({description:"Address State",example:"New York"})
    state:string

    @ApiProperty({description:"Address Latitude",example:40.7128,required:false})
    latitude?:number

    @ApiProperty({description:"Address Longitude",example:-74.0060,required:false})
    longitude?:number
}