import { Module } from '@nestjs/common';
import { CreateDriverUseCase } from './application/create-driver.use-case';
import { ListDriversUseCase } from './application/list-drivers.use-case';
import { ResetDriversUseCase } from './application/reset-drivers.use-case';
import { DriversController } from './api/drivers.controller';
import { DRIVER_REPOSITORY } from './domain/driver.repository';
import { InMemoryDriverRepository } from './infrastructure/in-memory-driver.repository';

@Module({
  controllers: [DriversController],
  providers: [
    CreateDriverUseCase,
    ListDriversUseCase,
    ResetDriversUseCase,
    InMemoryDriverRepository,
    {
      provide: DRIVER_REPOSITORY,
      useExisting: InMemoryDriverRepository
    }
  ]
})
export class DriversModule {}
