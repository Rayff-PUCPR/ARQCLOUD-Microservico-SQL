import { describe, expect, it } from 'vitest';
import { Order, OrderProps } from '../domain/order.entity';
import { OrderRepository } from '../domain/order.repository';
import { OrderStatus } from '../domain/order-status';
import { CreateOrderUseCase } from './create-order.use-case';

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

describe('CreateOrderUseCase', () => {
  it('creates a pending order through the repository port', async () => {
    const repository = new FakeOrderRepository();
    const useCase = new CreateOrderUseCase(repository);

    const order = await useCase.execute({
      customerName: 'Cliente Teste',
      customerPhone: '41999999999',
      deliveryAddress: {
        street: 'Rua Teste',
        number: '123',
        district: 'Centro',
        city: 'Curitiba',
        state: 'PR',
        zipCode: '80000-000',
        latitude: -25.4515,
        longitude: -49.2525
      },
      priority: 'HIGH',
      notes: 'Entregar na recepcao'
    });

    expect(order.id).toBeTruthy();
    expect(order.status).toBe('PENDING');
    expect(order.customer.trackingToken).toHaveLength(36);
    expect(repository.orders).toHaveLength(1);
  });
});
