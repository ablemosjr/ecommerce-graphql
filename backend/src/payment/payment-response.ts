import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import Stripe from 'stripe';

@ObjectType('PaymentResponse')
export class PaymentResponse {
  @Field(() => GraphQLJSON)
  response: Stripe.PaymentIntent;
}
