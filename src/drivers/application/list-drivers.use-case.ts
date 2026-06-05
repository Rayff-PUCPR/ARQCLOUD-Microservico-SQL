import { Inject, Injectable } from '@nestjs/common';
import { DRIVER_REPOSITORY, DriverRepository } from '../domain/driver.repository';

@Injectable()
export class ListDriversUseCase {
  constructor(
    @Inject(DRIVER_REPOSITORY) private readonly driverRepository: DriverRepository
  ) {}

  execute() {
    return this.driverRepository.findAll();
  }
}
