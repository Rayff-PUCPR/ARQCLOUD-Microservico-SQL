import { NotFoundException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { Driver, DriverProps } from '../domain/driver.entity';
import { DriverRepository } from '../domain/driver.repository';
import { UpdateDriverStatusUseCase } from './update-driver-status.use-case';

class FakeDriverRepository implements DriverRepository {
  drivers = new Map<string, DriverProps>();

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

describe('UpdateDriverStatusUseCase', () => {
  it('moves an available driver to on route', async () => {
    const repository = new FakeDriverRepository();
    const driver = await repository.create(Driver.create({
      name: 'Ana Martins',
      vehicle: 'Moto',
      status: 'AVAILABLE',
      region: 'Centro'
    }));

    const updated = await new UpdateDriverStatusUseCase(repository).execute(driver.id, 'ON_ROUTE');

    expect(updated.status).toBe('ON_ROUTE');
    expect(repository.drivers.get(driver.id)?.status).toBe('ON_ROUTE');
  });

  it('returns not found when the driver does not exist', async () => {
    const repository = new FakeDriverRepository();
    const useCase = new UpdateDriverStatusUseCase(repository);

    await expect(useCase.execute('missing-driver', 'AVAILABLE')).rejects.toBeInstanceOf(NotFoundException);
  });
});
