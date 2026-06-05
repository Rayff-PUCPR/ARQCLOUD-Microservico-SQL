import { Inject, Injectable } from '@nestjs/common';
import { Driver, DriverStatus } from '../domain/driver.entity';
import { DRIVER_REPOSITORY, DriverRepository } from '../domain/driver.repository';

export interface CreateDriverInput {
  name: string;
  vehicle: string;
  region: string;
  status?: DriverStatus;
}

@Injectable()
export class CreateDriverUseCase {
  constructor(
    @Inject(DRIVER_REPOSITORY) private readonly driverRepository: DriverRepository
  ) {}

  execute(input: CreateDriverInput) {
    const driver = Driver.create({
      name: input.name,
      vehicle: input.vehicle,
      region: input.region,
      status: input.status ?? 'AVAILABLE'
    });

    return this.driverRepository.create(driver);
  }
}
