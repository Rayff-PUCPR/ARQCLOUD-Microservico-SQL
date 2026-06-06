import { Driver, DriverProps } from './driver.entity';

export const DRIVER_REPOSITORY = Symbol('DRIVER_REPOSITORY');

export interface DriverRepository {
  create(driver: Driver): Promise<DriverProps>;
  findAll(): Promise<DriverProps[]>;
  findById(id: string): Promise<DriverProps | undefined>;
  save(driver: Driver): Promise<DriverProps>;
  reset(): Promise<void>;
}
