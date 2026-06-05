import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, OrderRepository } from '../domain/order.repository';

@Injectable()
export class ResetOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
  ) {}

  async execute() {
    await this.orderRepository.reset();
    return { reset: true };
  }
}
