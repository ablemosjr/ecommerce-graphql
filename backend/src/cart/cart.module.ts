import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/products/product.service';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, User, Category]),
  ],
  providers: [CartService, CartResolver, ProductService, UserService],
})
export class CartModule {}
