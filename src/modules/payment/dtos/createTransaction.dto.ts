import { IsDecimal, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Providers } from "../../../models";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty({
        description: "order id",
        example: 1,
        type: Number,
        required: true
    })
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @ApiProperty({
        description: "payment provider",
        example: Providers.ZARINPAL,
        type: String,
        required: true
    })
    @IsEnum(Providers)
    @IsNotEmpty()
    provider: Providers;
}