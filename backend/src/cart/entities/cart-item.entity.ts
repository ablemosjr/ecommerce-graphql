import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { Cart } from './cart.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
@ObjectType('CartItem')
export class CartItem {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Field()
  @Column('int')
  quantity: number;
}
