import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateCardItemInput } from './dto/create-cartItem.input';
import { UpdateCardItemInput } from './dto/update-cartItem.input';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cart)
  addCartItem(
    @CurrentUser() { id: userId }: User,
    @Args('createCartItemInput') createCartItemInput: CreateCardItemInput,
  ) {
    return this.cartService.addItem(userId, createCartItemInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cart)
  updateCartItem(
    @CurrentUser() { id: userId }: User,
    @Args('cartItemId') cartItemId: number,
    @Args('updateCartItemInput') updateCardItemInput: UpdateCardItemInput,
  ) {
    return this.cartService.updateItem(userId, cartItemId, updateCardItemInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cart)
  removeCartItem(
    @CurrentUser() { id: userId }: User,
    @Args('itemId') itemId: number,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Cart)
  getCartSummary(@CurrentUser() { id: userId }: User) {
    return this.cartService.getCartSummary(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Cart)
  async checkout(@CurrentUser() { id: userId }: User) {
    const cart = await this.cartService.getCartSummary(userId);
    return { message: 'Checkout sucessful' };
  }
}
