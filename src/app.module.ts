import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { OrdersModule } from './orders/orders.module';
import { DriversModule } from './drivers/drivers.module';

@Module({
  imports: [OrdersModule, DriversModule],
  controllers: [HealthController]
})
export class AppModule {}
