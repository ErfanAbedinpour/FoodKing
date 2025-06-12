import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { ZarinPalService } from "./strategies/zarinpal-strategy.service";
import { PaymentGateway } from "./strategies/payment-gateway";

@Module({
    controllers: [PaymentController],
    providers: [ZarinPalService, PaymentGateway]
})
export class PaymentModule { }