import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreateTransactionDto } from "./dtos/createTransaction.dto";

@Controller("checkout")
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    async createCheckout(@Body() body: CreateTransactionDto) {
        const authority = await this.paymentService.createSession(body);

        const url = await this.paymentService.getTransactionUrl(authority, body.provider);

        return {
            url
        }
    }

    @Get('callback')
    async callback(@Query() query: any) {
        console.log('i am here');
        console.log('query is ', query)
        return { query }
        // const authority = query.Authority;
        // const provider = query.Provider;

        // const transaction = await this.paymentService.getTransactionByAuthority(authority, provider);
    }
}