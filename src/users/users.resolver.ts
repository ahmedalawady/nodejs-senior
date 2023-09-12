import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ActivateUserInput } from './dto/activate-user';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async activateAccount(
    @Args('ActivateUserInput') activateUserInput: ActivateUserInput,
  ) {
    return await this.usersService.verifyActivationCode(activateUserInput.code);
  }

  @Query(() => User)
  async getUserByUsername(@Args('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }
}
