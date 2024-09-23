import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { OrderStatus } from 'src/utils/enums/OrderStatus';

@InputType()
export class UpdateOrderInput {
  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
