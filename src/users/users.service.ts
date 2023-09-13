import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './dto/user-mapper';
import { UserResponse } from './dto/user-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<UserResponse> {
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
    // Publish event to send email to the user has the activation code
    // Send the email here immediately
    const newUser = await this.usersRepository.save(user);
    return UserMapper.toResponse(newUser);
  }

  async getUserByUsername(email: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} doesn't exists`);
    }

    return UserMapper.toResponse(user);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponse | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return UserMapper.toResponse(user);
    }
    return null;
  }

  async verifyActivationCode(code: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({
      where: { activation_code: code, is_active: false },
    });
    // The code should have TTL
    if (!user) {
      throw new NotFoundException('Invalid activation code.');
    }

    user.is_active = true;
    await this.usersRepository.save(user);
    return UserMapper.toResponse(user);
  }
}
