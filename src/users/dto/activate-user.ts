import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ActivateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  code: string;
}
