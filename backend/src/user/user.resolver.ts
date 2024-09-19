import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => String)
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password);
  }

  @Query(() => User)
  findOne(@Args('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeUser(@Args('id') id: number, @CurrentUser() user: User) {
    return this.userService.remove(id);
  }
}
