import { Module } from '@nestjs/common';
import { CreateOrderUseCase } from './application/create-order.use-case';
import { AssignOrderRouteUseCase } from './application/assign-order-route.use-case';
import { ListOrdersUseCase } from './application/list-orders.use-case';
import { ResetOrdersUseCase } from './application/reset-orders.use-case';
import { UpdateOrderStatusUseCase } from './application/update-order-status.use-case';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { getPersistenceDriver } from '../config/app.config';
import { AzureSqlOrderRepository } from './infrastructure/azure-sql-order.repository';
import { InMemoryOrderRepository } from './infrastructure/in-memory-order.repository';
import { OrdersController } from './api/orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    AssignOrderRouteUseCase,
    ListOrdersUseCase,
    ResetOrdersUseCase,
    UpdateOrderStatusUseCase,
    AzureSqlOrderRepository,
    InMemoryOrderRepository,
    {
      provide: ORDER_REPOSITORY,
      useFactory: (
        inMemoryOrderRepository: InMemoryOrderRepository,
        azureSqlOrderRepository: AzureSqlOrderRepository
      ) => {
        return getPersistenceDriver() === 'azure-sql'
          ? azureSqlOrderRepository
          : inMemoryOrderRepository;
      },
      inject: [InMemoryOrderRepository, AzureSqlOrderRepository]
    }
  ],
  exports: [ORDER_REPOSITORY]
})
export class OrdersModule {}
