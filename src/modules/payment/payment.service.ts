import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { PaymentGateway } from "./strategies/payment-gateway";
import { CreateTransactionDto } from "./dtos/createTransaction.dto";
import Decimal from "decimal.js";
import { OrderService } from "../order/order.service";
import { EntityManager } from "@mikro-orm/postgresql";
import { Providers, Transaction, TransactionStatus } from "../../models";
import { Authority } from "./types/authority.types";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    constructor(private readonly paymentGateway: PaymentGateway, private readonly orderService: OrderService, private readonly em: EntityManager) { }

    async createSession({ orderId, provider }: CreateTransactionDto): Promise<Authority> {
        const order = await this.orderService.getOrderById(orderId);

        // get Payment Provider
        const paymentProvider = this.paymentGateway.getPaymentStrategy(provider);

        try {
            const authority = await paymentProvider.createTransaction(new Decimal(order.total_price), orderId);

            this.em.create(Transaction, {
                amount: new Decimal(order.total_price),
                provider,
                authority,
                order: order.id,
                status: TransactionStatus.PENDING,
            }, { persist: true })

            await this.em.flush();
            return authority;
        } catch (err) {
            this.logger.error(err)
            throw new InternalServerErrorException();
        }
    }


    async getTransactionUrl(authority: Authority, provider: Providers): Promise<string> {
        return this.paymentGateway.getPaymentStrategy(provider).getTransactionUrl(authority);
    }
}