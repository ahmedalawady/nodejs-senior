import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const isExist = await this.usersRepository.findOne({
      where: {
        email: createUserInput.email,
      },
    });

    if (isExist) {
      throw new HttpException(
        `User with this email or username already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  async getUserByUsername(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        `User with email ${email} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
