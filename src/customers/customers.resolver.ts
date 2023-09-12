import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomersService } from './customers-service';
import { GetCustomerInput } from './dto/customer.input';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Customer } from './customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Resolver()
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(() => [Customer])
  @UseGuards(JwtAuthGuard)
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customersService.findAll();
  }

  @Mutation(() => Customer)
  async signUpCustomer(
    @Args('signUpUserInput') createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(createCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Customer)
  updateUser(@Args('updateUserInput') updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(updateCustomerDto);
  }
}
