export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_ROUTE'
  | 'IN_ROUTE'
  | 'DELIVERED'
  | 'CANCELED';

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['AWAITING_ROUTE', 'CANCELED'],
  AWAITING_ROUTE: ['IN_ROUTE', 'CANCELED'],
  IN_ROUTE: ['DELIVERED', 'CANCELED'],
  DELIVERED: [],
  CANCELED: []
};

export function assertOrderStatusTransition(current: OrderStatus, next: OrderStatus) {
  if (!allowedTransitions[current].includes(next)) {
    throw new Error(`Invalid order status transition from ${current} to ${next}`);
  }
}
