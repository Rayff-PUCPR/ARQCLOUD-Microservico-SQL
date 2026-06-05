import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderUseCase, CreateOrderInput } from '../application/create-order.use-case';
import { AssignOrderRouteUseCase } from '../application/assign-order-route.use-case';
import { ListOrdersUseCase } from '../application/list-orders.use-case';
import { ResetOrdersUseCase } from '../application/reset-orders.use-case';
import { UpdateOrderStatusUseCase } from '../application/update-order-status.use-case';
import { OrderStatus } from '../domain/order-status';

@ApiTags('orders')
@Controller('api/v1/orders')
export class OrdersController {
  constructor(
    @Inject(CreateOrderUseCase)
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject(AssignOrderRouteUseCase)
    private readonly assignOrderRouteUseCase: AssignOrderRouteUseCase,
    @Inject(ListOrdersUseCase)
    private readonly listOrdersUseCase: ListOrdersUseCase,
    @Inject(ResetOrdersUseCase)
    private readonly resetOrdersUseCase: ResetOrdersUseCase,
    @Inject(UpdateOrderStatusUseCase)
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase
  ) {}

  @Post()
  create(@Body() body: CreateOrderInput) {
    return this.createOrderUseCase.execute(body);
  }

  @Get()
  list(@Query('status') status?: OrderStatus) {
    return this.listOrdersUseCase.execute(status);
  }

  @Get('pending')
  listPending() {
    return this.listOrdersUseCase.execute('PENDING');
  }

  @Post('reset')
  reset() {
    return this.resetOrdersUseCase.execute();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.updateOrderStatusUseCase.execute(id, status);
  }

  @Patch(':id/route')
  assignRoute(
    @Param('id') id: string,
    @Body('routeId') routeId: string,
    @Body('driverId') driverId?: string
  ) {
    return this.assignOrderRouteUseCase.execute(id, routeId, driverId);
  }
}
