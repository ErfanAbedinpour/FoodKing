import { PaymentStrategies } from "../abstract/payment-strategies";
import { Authority } from "../types/authority.types";
import { VerifyPayment } from "../types/verifyPayment";


export class ZarinPalService implements PaymentStrategies {

    async createTransaction(amount: number, orderId: string): Promise<Authority> {
        return "";
    }

    async getTransactionUrl(authority: Authority): Promise<string> {
        return "";
    }


    async refundTransaction(transactionId: string): Promise<void> {
        return;
    }

    async verifyTransaction(transaction_id: string): Promise<VerifyPayment> {
        return {
            code: 0,
            card_hash: "",
            card_pan: "",
            ref_id: 0,
            fee_type: "",
            fee: 0,
            shaparak_fee: 0,
            order_id: 0
        };
    }
}