import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderDto') createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Query(() => [Order])
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Query(() => Order)
  findOrderById(@Args('id') id: number) {
    return this.orderService.findOrderById(id);
  }

  @Mutation(() => Order)
  updateOrderStatus(
    @Args('id') id: number,
    @Args('updateOrderDto') updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderDto);
  }

  // At the moment the business model does not offer to exclude a purchase order
  // @Mutation(() => Boolean)
  // removeOrder(@Args('id') id: number) {
  //   return this.orderService.removeOrder(id);
  // }
}
