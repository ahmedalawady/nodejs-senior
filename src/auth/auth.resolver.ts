import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user-input';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { SignUpUserInput } from './dto/signup-input';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from 'src/users/users.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@Context() context: any) {
    const user = context.req?.user;
    return this.authService.me(user.email);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;
    const res = await this.userService.validateUser(email, password);
    if (!res) throw new BadRequestException('Invalid credentials');
    return this.authService.login(res);
  }

  @Mutation(() => Boolean)
  signUp(@Args('signUpUserInput') signUpUserInput: SignUpUserInput) {
    return this.authService.signUp(signUpUserInput);
  }
}
