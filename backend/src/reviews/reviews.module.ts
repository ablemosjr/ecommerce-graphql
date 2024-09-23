import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { Review } from './entities/review.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/products/product.service';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Product, Category])],
  providers: [ReviewsService, ReviewsResolver, UserService, ProductService],
})
export class ReviewsModule {}
