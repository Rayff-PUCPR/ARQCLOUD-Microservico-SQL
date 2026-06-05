import { randomUUID } from 'node:crypto';

export type DriverStatus = 'AVAILABLE' | 'ON_ROUTE' | 'OFFLINE';

export interface DriverProps {
  id: string;
  name: string;
  vehicle: string;
  status: DriverStatus;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export class Driver {
  private constructor(private readonly props: DriverProps) {}

  static create(input: Omit<DriverProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    return new Driver({
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now
    });
  }

  static restore(props: DriverProps) {
    return new Driver(props);
  }

  toJSON(): DriverProps {
    return { ...this.props };
  }
}
