import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
@ObjectType('Review')
export class Review {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  rating: number;

  @Field()
  @Column()
  comment: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
