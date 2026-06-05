import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../domain/order.entity';
import { ORDER_REPOSITORY, OrderRepository } from '../domain/order.repository';

@Injectable()
export class AssignOrderRouteUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
  ) {}

  async execute(orderId: string, routeId: string, driverId?: string) {
    const orderProps = await this.orderRepository.findById(orderId);
    if (!orderProps) {
      throw new NotFoundException('Order not found');
    }

    const order = Order.restore(orderProps);
    try {
      order.assignRoute(routeId, driverId);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.orderRepository.save(order);
  }
}
