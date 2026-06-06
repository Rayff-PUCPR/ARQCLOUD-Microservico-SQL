import { Injectable } from '@nestjs/common';
import { Driver, DriverProps } from '../domain/driver.entity';
import { DriverRepository } from '../domain/driver.repository';

@Injectable()
export class InMemoryDriverRepository implements DriverRepository {
  private readonly drivers = new Map<string, DriverProps>();

  constructor() {
    [
      Driver.create({
        name: 'Ana Martins',
        vehicle: 'Moto',
        status: 'AVAILABLE',
        region: 'Centro'
      }),
      Driver.create({
        name: 'Bruno Rocha',
        vehicle: 'Van',
        status: 'ON_ROUTE',
        region: 'Batel'
      })
    ].forEach((driver) => {
      const props = driver.toJSON();
      this.drivers.set(props.id, props);
    });
  }

  async create(driver: Driver) {
    const props = driver.toJSON();
    this.drivers.set(props.id, props);
    return props;
  }

  async findAll() {
    return Array.from(this.drivers.values());
  }

  async findById(id: string) {
    return this.drivers.get(id);
  }

  async save(driver: Driver) {
    const props = driver.toJSON();
    this.drivers.set(props.id, props);
    return props;
  }

  async reset() {
    this.drivers.clear();
  }
}
