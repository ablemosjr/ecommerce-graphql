import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.createOrder(createOrderInput);
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
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderInput);
  }

  // At the moment the business model does not offer to exclude a purchase order
  // @Mutation(() => Boolean)
  // removeOrder(@Args('id') id: number) {
  //   return this.orderService.removeOrder(id);
  // }
}
