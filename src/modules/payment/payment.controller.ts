import { BadGatewayException, Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreateTransactionDto } from "./dtos/createTransaction.dto";
import { createSessionSwagger } from "./payment.swagger";
import { IsAuth } from "../common/decorator/auth.decorator";
import { GetUser } from "../common/decorator/getUser.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("checkout")
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @ApiBearerAuth("JWT-AUTH")
    @IsAuth()
    @createSessionSwagger()
    async createCheckout(@Body() body: CreateTransactionDto, @GetUser("userId") userId: number) {
        const authority = await this.paymentService.createSession(body, userId);

        const url = await this.paymentService.getTransactionUrl(authority, body.provider);

        return {
            url
        }
    }

    @Get('callback')
    async callback(@Query() query: { Authority: string, Status: "OK" | "NOK" }) {
        if (query.Status !== "OK")
            throw new BadGatewayException("payment failed");

        const result = await this.paymentService.verifyTransaction(query.Authority)

        return {
            transaction_id: result.transaction_id,
            status: result.status
        }
    }
}