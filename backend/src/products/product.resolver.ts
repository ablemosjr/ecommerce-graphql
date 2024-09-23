import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
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
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.updateProduct(id, updateProductInput);
  }

  @Mutation(() => Boolean)
  removeProduct(@Args('id') id: number) {
    return this.productService.removeProduct(id);
  }
}
