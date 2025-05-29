import { ApiOperation, ApiProperty } from "@nestjs/swagger";

export class AddressDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    zip_code: string

    @ApiProperty()
    street: string

    @ApiProperty()
    city: string

    @ApiProperty()
    state: string

    @ApiProperty({ required: false })
    latitude?: number

    @ApiProperty({ required: false })
    longitude: number

    @ApiProperty()
    user: number
}