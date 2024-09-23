import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from 'src/category/entities/category.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
@ObjectType('Product')
export class Product {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column('decimal')
  price: number;

  @Field()
  @Column()
  sku: string; // Sku is a scannable code to help vendor track inventory (often appear as bar codes or QR codes)

  @Field()
  @Column()
  quantity: number;

  @Field()
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
