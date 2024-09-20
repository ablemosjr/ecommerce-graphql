import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

@InputType()
class OrderItemDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

@InputType()
export class CreateOrderDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @Field(() => [OrderItemDto])
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Add validation for each item
  @Type(() => OrderItemDto) // Helps convert this raw data into objects that follow its rules and validations
  items: OrderItemDto[];
}
