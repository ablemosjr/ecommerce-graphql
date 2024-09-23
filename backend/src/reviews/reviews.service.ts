import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/products/product.service';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async addReview(
    userId: number,
    productId: number,
    createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productService.findProductById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const review = this.reviewRepository.create({
      user,
      product,
      ...createReviewInput,
    });

    return await this.reviewRepository.save(review);
  }

  async updateReview(
    userId: number,
    reviewId: number,
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });

    if (!review) throw new NotFoundException('Review not found');

    review.rating = updateReviewInput.rating;
    review.comment = updateReviewInput.comment;

    return await this.reviewRepository.save(review);
  }

  async deleteReview(userId: number, reviewId: number): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });

    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepository.delete(review);
    return true;
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user', 'product'],
    });
  }
}
