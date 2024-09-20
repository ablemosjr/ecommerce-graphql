import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from 'src/utils/enums/OrderStatus';

@Entity()
@ObjectType('Order')
export class Order {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Field(() => OrderStatus)
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Field()
  @Column('decimal')
  total: number;

  @Field()
  @CreateDateColumn()
  createAt: Date;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (ordemItem) => ordemItem.order, { cascade: true })
  items: OrderItem[];
}
