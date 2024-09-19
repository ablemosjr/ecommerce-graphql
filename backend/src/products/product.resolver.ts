import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductDto,
  ) {
    return this.productService.createProduct(createProductInput);
  }

  @Query(() => [Product])
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Query(() => Product)
  findProductById(@Args('id') id: number) {
    return this.productService.findProductById(id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id') id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductInput);
  }

  @Mutation(() => Boolean)
  removeProduct(@Args('id') id: number) {
    return this.productService.removeProduct(id);
  }
}
