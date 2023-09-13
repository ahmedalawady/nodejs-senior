import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CustomerResponseDto {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  user_id: number;
}
