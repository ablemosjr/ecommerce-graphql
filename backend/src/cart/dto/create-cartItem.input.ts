import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateCardItemInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
