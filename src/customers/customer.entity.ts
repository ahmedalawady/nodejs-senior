import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Customer {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  user_id: number;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @CreateDateColumn()
  @Field()
  updated_at: Date;
}
