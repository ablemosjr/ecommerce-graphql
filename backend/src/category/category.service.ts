import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
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
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(categoryId);

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async removeCategory(categoryId: number): Promise<boolean> {
    const category = await this.findCategoryById(categoryId);

    await this.categoryRepository.remove(category);
    return true;
  }
}
