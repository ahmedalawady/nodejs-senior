import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

export interface ICustomerService {
  create(customer: CreateCustomerDto): Promise<Customer>;
  findAll(): Promise<Array<Customer>>;
  findOne(id: number): Promise<Customer>;
  update(updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
  delete(id: number): Promise<void>;
}
