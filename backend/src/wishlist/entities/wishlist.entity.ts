import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
@ObjectType('Wishlist')
export class Wishlist {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}
