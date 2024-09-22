import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentResolver } from './payment.resolver';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [PaymentService, PaymentResolver],
  controllers: [PaymentController],
})
export class PaymentModule {}
