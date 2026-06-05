import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { Order, DeliveryAddress, Priority } from '../domain/order.entity';
import { ORDER_REPOSITORY, OrderRepository } from '../domain/order.repository';

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  priority: Priority;
  notes?: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
  ) {}

  async execute(input: CreateOrderInput) {
    const order = Order.create({
      customer: {
        name: input.customerName,
        phone: input.customerPhone,
        trackingToken: randomBytes(18).toString('hex')
      },
      deliveryAddress: input.deliveryAddress,
      priority: input.priority,
      notes: input.notes
    });

    return this.orderRepository.create(order);
  }
}
