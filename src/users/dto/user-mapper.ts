import { UserResponse } from './user-response';
import { User } from '../user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    };
  }

  static toEntity(response: UserResponse): Partial<User> {
    return {
      id: Number(response.id),
      email: response.email,
      role: response.role,
      is_active: response.is_active,
    };
  }
}
