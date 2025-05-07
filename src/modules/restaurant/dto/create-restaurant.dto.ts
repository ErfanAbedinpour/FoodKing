import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRestaurantDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    en_name: string
}