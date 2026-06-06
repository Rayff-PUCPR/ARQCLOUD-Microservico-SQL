import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Driver, DriverStatus } from '../domain/driver.entity';
import { DRIVER_REPOSITORY, DriverRepository } from '../domain/driver.repository';

@Injectable()
export class UpdateDriverStatusUseCase {
  constructor(
    @Inject(DRIVER_REPOSITORY) private readonly driverRepository: DriverRepository
  ) {}

  async execute(driverId: string, status: DriverStatus) {
    const props = await this.driverRepository.findById(driverId);
    if (!props) {
      throw new NotFoundException('Driver not found');
    }

    const driver = Driver.restore(props);
    driver.updateStatus(status);
    return this.driverRepository.save(driver);
  }
}
