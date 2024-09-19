import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) throw new Error('Category not found');

    const product = this.productRepository.create({ ...rest, category });
    return this.productRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) throw new Error('Product not found');

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findProductById(id);
    const { categoryId, ...rest } = await updateProductDto;

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) throw new Error('Category not found');

      product.category = category;
    }

    Object.assign(product, rest);
    return this.productRepository.save(product);
  }

  async removeProduct(productId: number): Promise<boolean> {
    const product = await this.findProductById(productId);

    await this.productRepository.remove(product);
    return true;
  }
}
