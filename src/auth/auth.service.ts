import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpUserInput } from './dto/signup-input';
import { UserResponse } from 'src/users/dto/user-response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.validateUser(username, password);

    if (!user) {
      throw new NotFoundException('Invalid username or password');
    }

    return user;
  }

  async login(user: UserResponse) {
    return {
      access_token: this.jwtService.signAsync({
        username: user.email,
        sub: user.id,
      }),
      user,
    };
  }

  async signUp({ password, email, role }: SignUpUserInput) {
    const encryptedPassword = await bcrypt.hash(password, 10);

    await this.usersService.create({
      password: encryptedPassword,
      email,
      role,
    });

    return true;
  }

  async me(username: string) {
    return await this.usersService.getUserByUsername(username);
  }
}
