import { Customer } from '../customer.entity';
import { CustomerResponseDto } from './customer-response.dto';

export class CustomerMapper {
  static toDTO(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      user_id: customer.user_id,
    };
  }
}
