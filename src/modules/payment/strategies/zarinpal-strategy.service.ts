import Decimal from "decimal.js";
import { PaymentStrategies } from "../abstract/payment-strategies";
import { Authority } from "../types/authority.types";
import { VerifyPayment } from "../types/verifyPayment";
import { PaymentException } from "./exception/payment.exception";
import { error } from "console";


export class ZarinPalService implements PaymentStrategies {


    private readonly zarinpal_config = Object.freeze({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
        is_sandbox: process.env.IS_SANDBOX,
    });

    private readonly ZARINPAL_BASE_URL = `https://${this.zarinpal_config.is_sandbox ? "sandbox" : "payment"}.zarinpal.com/pg`;

    async createTransaction(amount: Decimal, orderId: number): Promise<Authority> {

        const body = {
            merchant_id: this.zarinpal_config.merchant_id,
            amount: amount.toNumber(),
            description: `خرید درگاه زرین پال شماره سفارش : ${orderId} به مبلغ ${amount.toString()} تومان`,
            callback_url: this.zarinpal_config.callback_url,
            order_id: String(orderId),
        }

        const resp = await (await fetch(`${this.ZARINPAL_BASE_URL}/v4/payment/request.json`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })).json()

        const error = resp['errors'] || [];

        if (error.length > 0) {
            throw new PaymentException(error[0].message)
        }

        const data = resp['data'];

        if (data.code !== 100)
            throw new PaymentException(data.message);

        return data.authority;
    }

    async getTransactionUrl(authority: Authority): Promise<string> {
        return `${this.ZARINPAL_BASE_URL}/StartPay/${authority}`
    }


    async refundTransaction(transactionId: string): Promise<void> {
        return;
    }

    async verifyTransaction(amount: Decimal, authority: string): Promise<VerifyPayment> {

        const body = {
            merchant_id: this.zarinpal_config.merchant_id,
            amount: amount.toNumber(),
            authority: authority,
        };

        const resp = await (await fetch(`${this.ZARINPAL_BASE_URL}/v4/payment/verify.json `, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })).json()

        console.log('resp is ', resp)

        const error = resp['errors'] || [];

        if (error.length !== 0) {
            throw new PaymentException(error.message)
        }

        const data = resp['data'];

        if (data.code !== 100 && data.code !== 101)
            throw new PaymentException(data.message);

        return data;
    }
}