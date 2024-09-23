import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/products/product.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productService.findProductById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const wishlistItem = this.wishlistRepository.create({ user, product });
    return await this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!wishlistItem) throw new NotFoundException('Wishlist item not found');

    await this.wishlistRepository.remove(wishlistItem);
    return true;
  }

  async viewWishlist(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }
}
