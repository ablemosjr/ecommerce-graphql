import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishlistService } from './wishlist.service';
import { WishlistResolver } from './wishlist.resolver';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/products/product.service';
import { Wishlist } from './entities/wishlist.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Product, Category])],
  providers: [WishlistService, WishlistResolver, UserService, ProductService],
})
export class WishlistModule {}
