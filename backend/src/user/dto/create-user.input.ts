import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  role?: string;
}
