import { IsDecimal, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Providers } from "../../../models";

export class CreateTransactionDto {
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @IsEnum(Providers)
    @IsNotEmpty()
    provider: Providers;
}