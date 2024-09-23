import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.createCategory(createCategoryInput);
  }

  @Query(() => [Category])
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Query(() => Category)
  findCategoryById(@Args('id') id: number) {
    return this.categoryService.findCategoryById(id);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id') id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }
}
