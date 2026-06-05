import { Injectable } from '@nestjs/common';
import { Order, OrderProps } from '../domain/order.entity';
import { OrderRepository } from '../domain/order.repository';
import { OrderStatus } from '../domain/order-status';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, OrderProps>();

  constructor() {
    const seedOrders = [
      {
        customerName: 'Marina Costa',
        customerPhone: '+55 41 98888-1100',
        deliveryAddress: {
          street: 'Rua Imaculada Conceicao',
          number: '1155',
          district: 'Prado Velho',
          city: 'Curitiba',
          state: 'PR',
          zipCode: '80215-901',
          latitude: -25.4515,
          longitude: -49.2525
        },
        priority: 'HIGH' as const,
        notes: 'Entregar na recepcao.'
      },
      {
        customerName: 'Andre Lima',
        customerPhone: '+55 41 97777-2200',
        deliveryAddress: {
          street: 'Avenida Sete de Setembro',
          number: '2775',
          district: 'Centro',
          city: 'Curitiba',
          state: 'PR',
          zipCode: '80050-255',
          latitude: -25.4386,
          longitude: -49.2707
        },
        priority: 'MEDIUM' as const,
        notes: 'Cliente prefere contato por telefone.'
      }
    ];

    seedOrders.forEach((seed) => {
      const order = Order.create({
        customer: {
          name: seed.customerName,
          phone: seed.customerPhone,
          trackingToken: cryptoToken()
        },
        deliveryAddress: seed.deliveryAddress,
        priority: seed.priority,
        notes: seed.notes
      });
      this.orders.set(order.toJSON().id, order.toJSON());
    });
  }

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

function cryptoToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}
