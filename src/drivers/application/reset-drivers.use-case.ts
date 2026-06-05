import { Inject, Injectable } from '@nestjs/common';
import { DRIVER_REPOSITORY, DriverRepository } from '../domain/driver.repository';

@Injectable()
export class ResetDriversUseCase {
  constructor(
    @Inject(DRIVER_REPOSITORY) private readonly driverRepository: DriverRepository
  ) {}

  async execute() {
    await this.driverRepository.reset();
    return { reset: true };
  }
}
