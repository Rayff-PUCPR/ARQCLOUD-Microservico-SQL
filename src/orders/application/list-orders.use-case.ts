import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from '../domain/order.repository';
import { OrderStatus } from '../domain/order-status';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
  ) {}

  execute(status?: OrderStatus) {
    return status ? this.orderRepository.findByStatus(status) : this.orderRepository.findAll();
  }
}
