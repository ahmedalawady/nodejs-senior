import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../types';
import * as bcrypt from 'bcrypt';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerMapper } from './dto/customer-mapper';
import { CustomerResponseDto } from './dto/customer-response.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly usersService: UsersService,
  ) {}

  async create(customer: CreateCustomerDto): Promise<CustomerResponseDto> {
    const encryptedPassword = await bcrypt.hash(customer.password, 10);

    const user = await this.usersService.create({
      password: encryptedPassword,
      email: customer.email,
      role: UserRole.USER,
    });

    const customerData = await this.customersRepository.save({
      name: customer.name,
      email: customer.email,
      user_id: user.id,
    });

    return CustomerMapper.toDTO(customerData);
  }

  //TODO handle pagination and filtering
  async findAll(): Promise<Array<Customer>> {
    const customers = await this.customersRepository.find();
    return customers;
  }

  async findOne(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      //TODO throw custom exception
      throw new NotFoundException(`Customer with id ${id} doesn't exists`);
    }

    return CustomerMapper.toDTO(customer);
  }

  async update(
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customersRepository.findOne({
      where: { id: updateCustomerDto.customer_id },
    });

    if (!customer) {
      throw new NotFoundException(
        `User with id ${updateCustomerDto.customer_id} not found`,
      );
    }
    delete updateCustomerDto.customer_id;
    const updatedUser = {
      ...customer,
      ...updateCustomerDto,
    };

    const updatedCustomer = await this.customersRepository.save(updatedUser);
    return CustomerMapper.toDTO(updatedCustomer);
  }

  async delete(id: number): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
