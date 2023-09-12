import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Generated,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ type: 'enum', enum: UserRole, update: false })
  @Field()
  role: UserRole;

  @Column({ default: false })
  @Field()
  is_active: boolean;

  @Column()
  @Generated('uuid')
  @Field()
  activation_code: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
