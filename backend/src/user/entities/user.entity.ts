import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Order } from 'src/order/entities/order.entity';
import { UserRole } from 'src/utils/enums/UserRole';
import { Cart } from 'src/cart/entities/cart.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
@ObjectType('User')
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: false })
  @Column()
  name: string;

  @Field({ nullable: false })
  @Column({ unique: true })
  email: string;

  @Field({ nullable: false })
  @Column()
  password: string;

  @Field(() => UserRole, { nullable: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role?: UserRole;

  @Field({ nullable: true })
  @Column({ default: '' })
  profile?: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
