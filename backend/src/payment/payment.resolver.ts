import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { PaymentService } from './payment.service';
import { PaymentResponse } from './payment-response';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => PaymentResponse)
  async createPaymentIntent(
    @Args('orderId') orderId: number,
  ): Promise<PaymentResponse> {
    const paymentIntent =
      await this.paymentService.createPaymentIntent(orderId);

    return { response: paymentIntent };
  }
}
