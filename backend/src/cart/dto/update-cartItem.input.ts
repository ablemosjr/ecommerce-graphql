import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateCardItemInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
