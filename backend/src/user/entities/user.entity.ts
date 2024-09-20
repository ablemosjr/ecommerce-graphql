import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType('User')
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: false })
  @Column({ unique: true })
  email: string;

  @Field({ nullable: false })
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ default: 'customer', nullable: true })
  role?: string; // 'admin' or 'customer' (enum?)

  @Field({ nullable: true })
  @Column({ default: '' })
  profile: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];
}
