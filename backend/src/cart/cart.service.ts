import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/products/product.service';
import { CreateCardItemInput } from './dto/create-cartItem.input';
import { UpdateCardItemInput } from './dto/update-cartItem.input';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async findOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });

    if (!cart) {
      const user = await this.userService.findById(userId);

      if (!user) throw new NotFoundException('User not found');

      cart = this.cartRepository.create({ user, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(
    userId: number,
    createCartItemInput: CreateCardItemInput,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const { productId, quantity } = createCartItemInput;
    const product = await this.productService.findProductById(productId);

    if (!product) throw new NotFoundException('Product not found');

    let cartItem = Array.isArray(cart.items)
      ? cart.items.find((item) => item.product.id === productId)
      : undefined;

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({ cart, product, quantity });
      cart.items.push(cartItem);
    }

    await this.cartRepository.save(cartItem);
    return this.cartRepository.save(cart);
  }

  async updateItem(
    userId: number,
    cartItemId: number,
    updateCartItemInput: UpdateCardItemInput,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const cartItem = cart.items.find((item) => item.id === cartItemId);

    if (!cartItem) throw new NotFoundException('Cart item not found');

    cartItem.quantity = updateCartItemInput.quantity;
    await this.cartItemRepository.save(cartItem);
    return this.cartRepository.save(cart);
  }

  async removeItem(userId: number, cartItemId: number): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const cartItemIndex = cart.items.findIndex(
      (item) => item.id === cartItemId,
    );

    if (cartItemIndex === -1) {
      throw new NotFoundException('Cart item not found');
    }

    const [cartItem] = cart.items.splice(cartItemIndex, 1);
    await this.cartItemRepository.remove(cartItem);
    return this.cartRepository.save(cart);
  }

  async getCartSummary(userId: number): Promise<Cart> {
    return this.findOrCreateCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.findOrCreateCart(userId);

    await this.cartItemRepository.remove(cart.items);
    cart.items = [];
    await this.cartRepository.save(cart);
  }
}
