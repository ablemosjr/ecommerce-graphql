import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductService } from 'src/products/product.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from 'src/utils/enums/OrderStatus';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;
    const user = await this.userService.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = await this.productService.findProductById(item.productId);

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });

      orderItems.push(orderItem);
      total += orderItem.price;
    }

    const order = this.orderRepository.create({
      user,
      status: OrderStatus.PLACED,
      total,
      items: orderItems,
    });

    return await this.orderRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findOrderById(orderId);

    if (!order) throw new NotFoundException('Order not found');

    order.status = updateOrderDto.status;

    return await this.orderRepository.save(order);
  }

  async removeOrder(orderId: number): Promise<boolean> {
    const order = await this.findOrderById(orderId);

    if (!order) throw new NotFoundException('Order not found');

    await this.orderRepository.delete(order);

    return true;
  }
}
