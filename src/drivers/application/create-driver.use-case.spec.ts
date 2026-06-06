import { describe, expect, it } from 'vitest';
import { Driver, DriverProps } from '../domain/driver.entity';
import { DriverRepository } from '../domain/driver.repository';
import { CreateDriverUseCase } from './create-driver.use-case';

class FakeDriverRepository implements DriverRepository {
  drivers: DriverProps[] = [];

  async create(driver: Driver) {
    const props = driver.toJSON();
    this.drivers.push(props);
    return props;
  }

  async findAll() {
    return this.drivers;
  }

  async findById(id: string) {
    return this.drivers.find((driver) => driver.id === id);
  }

  async save(driver: Driver) {
    const props = driver.toJSON();
    this.drivers = this.drivers.map((item) => (item.id === props.id ? props : item));
    return props;
  }

  async reset() {
    this.drivers = [];
  }
}

describe('CreateDriverUseCase', () => {
  it('creates an available driver by default', async () => {
    const repository = new FakeDriverRepository();
    const useCase = new CreateDriverUseCase(repository);

    const driver = await useCase.execute({
      name: 'Joao Driver',
      vehicle: 'Moto',
      region: 'Centro'
    });

    expect(driver.id).toBeTruthy();
    expect(driver.status).toBe('AVAILABLE');
    expect(repository.drivers).toHaveLength(1);
  });
});
