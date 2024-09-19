import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryDto,
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
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }
}
