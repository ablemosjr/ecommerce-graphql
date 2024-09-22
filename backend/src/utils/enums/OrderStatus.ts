import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'pending',
  PLACED = 'placed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  PAID = 'paid',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
