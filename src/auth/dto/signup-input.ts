import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../types';

registerEnumType(UserRole, {
  name: 'AllowedRole',
});

@InputType()
export class SignUpUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field((type) => UserRole)
  @IsNotEmpty()
  @IsString()
  role: UserRole;
}
