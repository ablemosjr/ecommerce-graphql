import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewService: ReviewsService) {}

  @Mutation(() => Review)
  addReview(
    @CurrentUser() { id: userId }: User,
    @Args('productId') productId: number,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ) {
    return this.reviewService.addReview(userId, productId, createReviewInput);
  }

  @Mutation(() => Review)
  updateReview(
    @CurrentUser() { id: userId }: User,
    @Args('reviewId') reviewId: number,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ) {
    return this.reviewService.updateReview(userId, reviewId, updateReviewInput);
  }

  @Mutation(() => Boolean)
  deleteReview(
    @CurrentUser() { id: userId }: User,
    @Args('reviewId') reviewId: number,
  ) {
    return this.reviewService.deleteReview(userId, reviewId);
  }

  @Query(() => [Review])
  getProductReviews(@Args('productId') productId: number) {
    return this.reviewService.getProductReviews(productId);
  }
}
