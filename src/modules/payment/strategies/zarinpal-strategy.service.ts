import Decimal from "decimal.js";
import { PaymentStrategies } from "../abstract/payment-strategies";
import { Authority } from "../types/authority.types";
import { VerifyPayment } from "../types/verifyPayment";


export class ZarinPalService implements PaymentStrategies {

    private readonly zarinpal_config = {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
    }
    constructor() {

    }

    async createTransaction(amount: Decimal, orderId: number): Promise<Authority> {
        const body = {}

        const resp = await fetch("https://payment.zarinpal.com/pg/v4/payment/request.json", {
            method: "POST",
            body: JSON.stringify(body)
        })

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