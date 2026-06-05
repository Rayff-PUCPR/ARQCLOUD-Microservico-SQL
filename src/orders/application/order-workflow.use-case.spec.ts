import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { Order, OrderProps } from '../domain/order.entity';
import { OrderRepository } from '../domain/order.repository';
import { OrderStatus } from '../domain/order-status';
import { AssignOrderRouteUseCase } from './assign-order-route.use-case';
import { UpdateOrderStatusUseCase } from './update-order-status.use-case';

class FakeOrderRepository implements OrderRepository {
  orders = new Map<string, OrderProps>();

  async create(order: Order) {
    const props = order.toJSON();
    this.orders.set(props.id, props);
    return props;
  }

  async findAll() {
    return Array.from(this.orders.values());
  }

  async findById(id: string) {
    return this.orders.get(id);
  }

  async findByStatus(status: OrderStatus) {
    return Array.from(this.orders.values()).filter((order) => order.status === status);
  }

  async save(order: Order) {
    const props = order.toJSON();
    this.orders.set(props.id, props);
    return props;
  }

  async reset() {
    this.orders.clear();
  }
}

describe('Order workflow use cases', () => {
  it('assigns a pending order to a route and moves it to awaiting route', async () => {
    const repository = new FakeOrderRepository();
    const order = await repository.create(makeOrder());
    const useCase = new AssignOrderRouteUseCase(repository);

    const assigned = await useCase.execute(order.id, 'route-1', 'driver-1');

    expect(assigned.routeId).toBe('route-1');
    expect(assigned.driverId).toBe('driver-1');
    expect(assigned.status).toBe('AWAITING_ROUTE');
  });

  it('moves an assigned order through the valid delivery flow', async () => {
    const repository = new FakeOrderRepository();
    const order = makeOrder();
    order.assignRoute('route-1');
    const saved = await repository.create(order);
    const useCase = new UpdateOrderStatusUseCase(repository);

    const inRoute = await useCase.execute(saved.id, 'IN_ROUTE');
    expect(inRoute.status).toBe('IN_ROUTE');

    const delivered = await useCase.execute(saved.id, 'DELIVERED');

    expect(delivered.status).toBe('DELIVERED');
  });

  it('rejects invalid status transitions as application errors', async () => {
    const repository = new FakeOrderRepository();
    const order = await repository.create(makeOrder());
    const useCase = new UpdateOrderStatusUseCase(repository);

    await expect(useCase.execute(order.id, 'DELIVERED')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns not found when the order does not exist', async () => {
    const repository = new FakeOrderRepository();
    const useCase = new AssignOrderRouteUseCase(repository);

    await expect(useCase.execute('missing-order', 'route-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

function makeOrder() {
  return Order.create({
    customer: {
      name: 'Cliente Teste',
      phone: '41999999999',
      trackingToken: 'tracking-token'
    },
    deliveryAddress: {
      street: 'Rua Teste',
      number: '123',
      district: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80000-000'
    },
    priority: 'MEDIUM'
  });
}
