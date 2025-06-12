import Decimal from "decimal.js";
import { Authority } from "../types/authority.types";
import { VerifyPayment } from "../types/verifyPayment";



export abstract class PaymentStrategies {

    abstract createTransaction(amount: Decimal, orderId: number): Promise<Authority>;

    abstract getTransactionUrl(authority: Authority): Promise<string>;

    abstract verifyTransaction(transaction_id: string): Promise<VerifyPayment>;

    abstract refundTransaction(transactionId: string): Promise<void>;
}