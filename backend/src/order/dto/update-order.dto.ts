import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { OrderStatus } from 'src/utils/enums/OrderStatus';

@InputType()
export class UpdateOrderDto {
  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
