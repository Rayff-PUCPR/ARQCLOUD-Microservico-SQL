import { Order, OrderProps } from './order.entity';
import { OrderStatus } from './order-status';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepository {
  create(order: Order): Promise<OrderProps>;
  findAll(): Promise<OrderProps[]>;
  findById(id: string): Promise<OrderProps | undefined>;
  findByStatus(status: OrderStatus): Promise<OrderProps[]>;
  save(order: Order): Promise<OrderProps>;
  reset(): Promise<void>;
}
