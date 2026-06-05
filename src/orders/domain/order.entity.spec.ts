import { describe, expect, it } from 'vitest';
import { Order } from './order.entity';

function makeOrder() {
  return Order.create({
    customer: {
      name: 'Cliente Teste',
      phone: '41999999999',
      trackingToken: 'token'
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

describe('Order entity', () => {
  it('creates a pending order', () => {
    const order = makeOrder().toJSON();

    expect(order.id).toBeTruthy();
    expect(order.status).toBe('PENDING');
    expect(order.customer.name).toBe('Cliente Teste');
  });

  it('prevents invalid status transitions', () => {
    const order = makeOrder();

    expect(() => order.updateStatus('DELIVERED')).toThrow('Invalid order status transition');
  });
});
