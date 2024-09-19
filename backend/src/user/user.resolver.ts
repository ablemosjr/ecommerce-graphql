import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Query(() => User)
  async findOne(@Args('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: number, @CurrentUser() user: User) {
    return this.userService.remove(id);
  }
}
