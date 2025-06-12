import { BadGatewayException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PaymentGateway } from "./strategies/payment-gateway";
import { CreateTransactionDto } from "./dtos/createTransaction.dto";
import Decimal from "decimal.js";
import { OrderService } from "../order/order.service";
import { EntityManager } from "@mikro-orm/postgresql";
import { Providers, Transaction, TransactionStatus } from "../../models";
import { Authority } from "./types/authority.types";
import { PaymentException } from "./strategies/exception/payment.exception";
import { OrderStatus } from "../../models/order.model";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    constructor(private readonly paymentGateway: PaymentGateway, private readonly orderService: OrderService, private readonly em: EntityManager) { }

    async createSession({ orderId, provider }: CreateTransactionDto, userId: number): Promise<Authority> {
        const order = await this.orderService.getUserOrderById(userId, orderId);

        // get Payment Provider
        const paymentProvider = this.paymentGateway.getPaymentStrategy(provider);

        try {
            const amount = this.convertToRial(new Decimal(order.total_price))

            const authority = await paymentProvider.createTransaction(amount, orderId);

            this.em.create(Transaction, {
                // multiply by 10 because zarinpal api is in Rial
                amount: amount,
                provider,
                authority,
                order: order.id,
                status: TransactionStatus.PENDING,
            }, { persist: true })

            await this.em.flush();
            return authority;
        } catch (err) {
            if (err instanceof PaymentException)
                throw new BadGatewayException(err.message);

            this.logger.error(err)
            throw new InternalServerErrorException();
        }
    }


    async getTransactionUrl(authority: Authority, provider: Providers): Promise<string> {
        return this.paymentGateway.getPaymentStrategy(provider).getTransactionUrl(authority);
    }

    async verifyTransaction(authority: string): Promise<{ transaction_id: string, status: TransactionStatus }> {

        const transaction = await this.em.findOne(Transaction, {
            authority: authority
        });

        if (!transaction)
            throw new NotFoundException("transaction not found");

        const paymentProvider = this.paymentGateway.getPaymentStrategy(transaction.provider);

        try {
            const verifyPayment = await paymentProvider.verifyTransaction(new Decimal(transaction.amount), authority);

            transaction.transaction_id = verifyPayment.ref_id.toString();
            transaction.status = TransactionStatus.SUCCESS;
            transaction.order.status = OrderStatus.Processing;

            await this.em.flush();

            return {
                transaction_id: transaction.transaction_id,
                status: TransactionStatus.SUCCESS,
            }
        } catch (err) {
            if (err instanceof PaymentException)
                throw new BadGatewayException(err.message);

            this.logger.error(err)
            throw new InternalServerErrorException();
        }

    }


    private convertToRial(amount: Decimal): Decimal {
        return amount.mul(10);
    }

    private convertToToman(amount: Decimal): Decimal {
        return amount.div(10);
    }
}