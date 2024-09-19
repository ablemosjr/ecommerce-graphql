import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateProductDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
