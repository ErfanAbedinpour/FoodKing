export type VerifyPayment = {
    code: number;
    card_hash: string;
    card_pan: string;
    ref_id: number;
    fee_type: string;
    fee: number;
    shaparak_fee: number;
    order_id: number
}