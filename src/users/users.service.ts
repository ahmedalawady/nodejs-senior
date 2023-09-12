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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
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
    return this.usersRepository.save(user);
  }

  // _generateActivationCode(): string {
  //   return uuidv4();
  // }

  async getUserByUsername(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} doesn't exists`);
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

  async verifyActivationCode(code: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { activation_code: code, is_active: false },
    });
    // The code should have TTL
    if (!user) {
      throw new NotFoundException('Invalid activation code.');
    }

    user.is_active = true;
    await this.usersRepository.save(user);
    return user;
  }
}
