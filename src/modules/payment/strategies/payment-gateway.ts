import { Injectable } from "@nestjs/common";
import { Providers } from "../../../models";
import { PaymentStrategies } from "../abstract/payment-strategies";
import { ZarinPalService } from "./zarinpal-strategy.service";

@Injectable()
export class PaymentGateway {

    private container: Map<Providers, PaymentStrategies> = new Map();

    constructor(private readonly zarinPalService: ZarinPalService) {
        this.container.set(Providers.ZARINPAL, this.zarinPalService);
    }


    getPaymentStrategy(provider: Providers): PaymentStrategies {
        const result = this.container.get(provider);

        if (!result)
            throw new Error(`Provider ${provider} not found`);

        return result;
    }
}