import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';

import { Order } from 'src/order/entities/order.entity';
import { OrderStatus } from 'src/utils/enums/OrderStatus';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }

  constructEventFromPayload(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new BadRequestException('Order not found');

    if (order.status === OrderStatus.CANCELED) {
      throw new BadRequestException(
        'Order has been canceled, cannot create payment intent',
      );
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'brl',
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = parseInt(paymentIntent.metadata.orderId);

      const order = await this.orderRepository.findOneBy({ id: orderId });

      if (order) {
        order.status = OrderStatus.PAID;
        await this.orderRepository.save(order);
      } else {
        console.log(`Order ${orderId} not found`);
      }
    }
  }
}
