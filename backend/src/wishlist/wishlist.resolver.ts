import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Wishlist } from './entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Resolver(() => Wishlist)
export class WishlistResolver {
  constructor(private readonly wishlistService: WishlistService) {}

  @Mutation(() => Wishlist)
  addToWishlist(
    @CurrentUser() { id: userId }: User,
    @Args('productId') productId: number,
  ) {
    return this.wishlistService.addToWishlist(userId, productId);
  }

  @Mutation(() => Boolean)
  removeFromWishlist(
    @CurrentUser() { id: userId }: User,
    @Args('productId') productId: number,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Query(() => [Wishlist])
  viewWishlist(@CurrentUser() { id: userId }: User) {
    return this.wishlistService.viewWishlist(userId);
  }
}
