import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../../types';

registerEnumType(UserRole, {
  name: 'AllowedRole',
});

@InputType()
export class UserResponse {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field((type) => UserRole)
  role: UserRole;

  @Field()
  is_active: boolean;
}
