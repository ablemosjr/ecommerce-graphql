import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Order } from './entities/order.entity';
import { ProductService } from 'src/products/product.service';
import { UserService } from 'src/user/user.service';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { CategoryModule } from 'src/category/category.module';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Product, Category]),
  ],
  providers: [OrderService, OrderResolver, UserService, ProductService],
})
export class OrderModule {}
