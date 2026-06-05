import { randomUUID } from 'node:crypto';
import { OrderStatus, assertOrderStatusTransition } from './order-status';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CustomerSnapshot {
  name: string;
  phone: string;
  trackingToken: string;
}

export interface DeliveryAddress {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderProps {
  id: string;
  customer: CustomerSnapshot;
  deliveryAddress: DeliveryAddress;
  priority: Priority;
  notes?: string;
  status: OrderStatus;
  routeId?: string;
  driverId?: string;
  createdAt: string;
  updatedAt: string;
}

export class Order {
  private constructor(private readonly props: OrderProps) {}

  static create(input: Omit<OrderProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    return new Order({
      ...input,
      id: randomUUID(),
      status: 'PENDING',
      createdAt: now,
      updatedAt: now
    });
  }

  static restore(props: OrderProps) {
    return new Order(props);
  }

  updateStatus(nextStatus: OrderStatus) {
    assertOrderStatusTransition(this.props.status, nextStatus);
    this.props.status = nextStatus;
    this.touch();
  }

  assignRoute(routeId: string, driverId?: string) {
    if (this.props.status === 'DELIVERED' || this.props.status === 'CANCELED') {
      throw new Error('Finished or canceled orders cannot be assigned to routes');
    }

    this.props.routeId = routeId;
    this.props.driverId = driverId;
    if (this.props.status === 'PENDING') {
      this.props.status = 'AWAITING_ROUTE';
    }
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date().toISOString();
  }

  toJSON(): OrderProps {
    return { ...this.props };
  }
}
