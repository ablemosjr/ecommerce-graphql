import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { email, password, role } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: role ?? 'customer',
    });

    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<void> {
    const { password, profile } = updateUserInput;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    await this.usersRepository.update(id, {
      ...(password && { password: hashedPassword }),
      ...(profile && { profile }),
    });
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findById(id);

    if (!user) throw new Error('User not found');

    await this.usersRepository.delete(id);
    return true;
  }
}
