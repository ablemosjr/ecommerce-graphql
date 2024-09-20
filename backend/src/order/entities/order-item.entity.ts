import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
@ObjectType('OrderItem')
export class OrderItem {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Field()
  @Column('int')
  quantity: number;

  @Field()
  @Column('decimal')
  price: number;
}
