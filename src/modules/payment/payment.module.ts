import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { ZarinPalService } from "./strategies/zarinpal-strategy.service";
import { PaymentGateway } from "./strategies/payment-gateway";
import { OrderModule } from "../order/order.module";
import { PaymentService } from "./payment.service";

@Module({
    imports: [OrderModule],
    controllers: [PaymentController],
    providers: [ZarinPalService, PaymentGateway, PaymentService]
})
export class PaymentModule { }