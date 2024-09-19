import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
