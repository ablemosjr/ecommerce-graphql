import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @Field()
  @IsOptional()
  @IsString()
  profile?: string;
}
