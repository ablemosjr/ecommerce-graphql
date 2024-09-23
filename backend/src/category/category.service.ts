import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CreateCategoryInput } from './dto/create-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryInput);
    return this.categoryRepository.save(category);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async findCategoryById(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });

    if (!category) throw new Error('Category not found');

    return category;
  }

  async updateCategory(
    categoryId: number,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.findCategoryById(categoryId);

    Object.assign(category, updateCategoryInput);
    return this.categoryRepository.save(category);
  }

  async removeCategory(categoryId: number): Promise<boolean> {
    const category = await this.findCategoryById(categoryId);

    await this.categoryRepository.remove(category);
    return true;
  }
}
