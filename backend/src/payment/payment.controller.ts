import {
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { PaymentService } from './payment.service';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    // const signature = this.getSignature(request.headers['stripe-signature']);
    let stripeEvent: Stripe.Event;

    try {
      stripeEvent = this.paymentService.constructEventFromPayload(
        sig,
        req.rawBody,
      );
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    await this.paymentService.handleWebhook(stripeEvent);
    res.status(200).send({ received: true });
  }

  getSignature(signature: string | string[] | undefined): string | null {
    if (Array.isArray(signature)) {
      return signature[0];
    }
    return typeof signature === 'string' ? signature : null;
  }
}
