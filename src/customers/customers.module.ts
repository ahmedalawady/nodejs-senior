import { Module } from '@nestjs/common';
import { CustomersService } from './customers-service';
import { CustomersResolver } from './customers.resolver';
import { Customer } from './customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), UsersModule],
  controllers: [],
  providers: [CustomersService, CustomersResolver],
  exports: [CustomersService],
})
export class CustomersModule {}
