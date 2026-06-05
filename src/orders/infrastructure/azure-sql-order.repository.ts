import { Injectable, OnModuleDestroy } from '@nestjs/common';
import sql, { ConnectionPool, IRecordSet } from 'mssql';
import { getAzureSqlConfig } from '../../config/app.config';
import { Order, OrderProps, Priority } from '../domain/order.entity';
import { OrderRepository } from '../domain/order.repository';
import { OrderStatus } from '../domain/order-status';

interface OrderRow {
  id: string;
  customerName: string;
  customerPhone: string;
  trackingToken: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  priority: Priority;
  notes: string | null;
  status: OrderStatus;
  routeId: string | null;
  driverId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

@Injectable()
export class AzureSqlOrderRepository implements OrderRepository, OnModuleDestroy {
  private pool?: ConnectionPool;

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close();
    }
  }

  async create(order: Order) {
    const props = order.toJSON();
    await this.bindOrderInputs(await this.request(), props).query(`
      INSERT INTO dbo.Orders (
        id, customerName, customerPhone, trackingToken, street, number, district, city, state,
        zipCode, latitude, longitude, priority, notes, status, routeId, driverId, createdAt, updatedAt
      )
      VALUES (
        @id, @customerName, @customerPhone, @trackingToken, @street, @number, @district, @city,
        @state, @zipCode, @latitude, @longitude, @priority, @notes, @status, @routeId, @driverId,
        @createdAt, @updatedAt
      )
    `);
    return props;
  }

  async findAll() {
    const result = await (await this.request()).query<OrderRow>(`
      SELECT * FROM dbo.Orders ORDER BY createdAt DESC
    `);
    return this.mapRows(result.recordset);
  }

  async findById(id: string) {
    const result = await (await this.request())
      .input('id', sql.NVarChar(64), id)
      .query<OrderRow>('SELECT TOP 1 * FROM dbo.Orders WHERE id = @id');

    return result.recordset[0] ? this.mapRow(result.recordset[0]) : undefined;
  }

  async findByStatus(status: OrderStatus) {
    const result = await (await this.request())
      .input('status', sql.NVarChar(30), status)
      .query<OrderRow>('SELECT * FROM dbo.Orders WHERE status = @status ORDER BY createdAt DESC');

    return this.mapRows(result.recordset);
  }

  async save(order: Order) {
    const props = order.toJSON();
    await this.bindOrderInputs(await this.request(), props).query(`
      UPDATE dbo.Orders
      SET
        customerName = @customerName,
        customerPhone = @customerPhone,
        trackingToken = @trackingToken,
        street = @street,
        number = @number,
        district = @district,
        city = @city,
        state = @state,
        zipCode = @zipCode,
        latitude = @latitude,
        longitude = @longitude,
        priority = @priority,
        notes = @notes,
        status = @status,
        routeId = @routeId,
        driverId = @driverId,
        updatedAt = @updatedAt
      WHERE id = @id
    `);
    return props;
  }

  async reset() {
    await (await this.request()).query('DELETE FROM dbo.Orders');
  }

  private async request() {
    return (await this.getPool()).request();
  }

  private async getPool() {
    if (!this.pool) {
      this.pool = await sql.connect(getAzureSqlConfig());
    }
    return this.pool;
  }

  private bindOrderInputs(request: sql.Request, props: OrderProps) {
    return request
      .input('id', sql.NVarChar(64), props.id)
      .input('customerName', sql.NVarChar(160), props.customer.name)
      .input('customerPhone', sql.NVarChar(40), props.customer.phone)
      .input('trackingToken', sql.NVarChar(80), props.customer.trackingToken)
      .input('street', sql.NVarChar(180), props.deliveryAddress.street)
      .input('number', sql.NVarChar(30), props.deliveryAddress.number)
      .input('district', sql.NVarChar(120), props.deliveryAddress.district)
      .input('city', sql.NVarChar(120), props.deliveryAddress.city)
      .input('state', sql.NVarChar(2), props.deliveryAddress.state)
      .input('zipCode', sql.NVarChar(20), props.deliveryAddress.zipCode)
      .input('latitude', sql.Float, props.deliveryAddress.latitude ?? null)
      .input('longitude', sql.Float, props.deliveryAddress.longitude ?? null)
      .input('priority', sql.NVarChar(20), props.priority)
      .input('notes', sql.NVarChar(sql.MAX), props.notes ?? null)
      .input('status', sql.NVarChar(30), props.status)
      .input('routeId', sql.NVarChar(64), props.routeId ?? null)
      .input('driverId', sql.NVarChar(64), props.driverId ?? null)
      .input('createdAt', sql.DateTime2, new Date(props.createdAt))
      .input('updatedAt', sql.DateTime2, new Date(props.updatedAt));
  }

  private mapRows(rows: IRecordSet<OrderRow>) {
    return rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: OrderRow): OrderProps {
    return {
      id: row.id,
      customer: {
        name: row.customerName,
        phone: row.customerPhone,
        trackingToken: row.trackingToken
      },
      deliveryAddress: {
        street: row.street,
        number: row.number,
        district: row.district,
        city: row.city,
        state: row.state,
        zipCode: row.zipCode,
        latitude: row.latitude ?? undefined,
        longitude: row.longitude ?? undefined
      },
      priority: row.priority,
      notes: row.notes ?? undefined,
      status: row.status,
      routeId: row.routeId ?? undefined,
      driverId: row.driverId ?? undefined,
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt)
    };
  }
}

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
