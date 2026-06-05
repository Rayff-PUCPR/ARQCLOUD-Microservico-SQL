import { Driver, DriverProps } from './driver.entity';

export const DRIVER_REPOSITORY = Symbol('DRIVER_REPOSITORY');

export interface DriverRepository {
  create(driver: Driver): Promise<DriverProps>;
  findAll(): Promise<DriverProps[]>;
  reset(): Promise<void>;
}
