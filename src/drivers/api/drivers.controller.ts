import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDriverInput, CreateDriverUseCase } from '../application/create-driver.use-case';
import { ListDriversUseCase } from '../application/list-drivers.use-case';
import { ResetDriversUseCase } from '../application/reset-drivers.use-case';
import { UpdateDriverStatusUseCase } from '../application/update-driver-status.use-case';
import { DriverStatus } from '../domain/driver.entity';

@ApiTags('drivers')
@Controller('api/v1/drivers')
export class DriversController {
  constructor(
    @Inject(CreateDriverUseCase)
    private readonly createDriverUseCase: CreateDriverUseCase,
    @Inject(ListDriversUseCase)
    private readonly listDriversUseCase: ListDriversUseCase,
    @Inject(ResetDriversUseCase)
    private readonly resetDriversUseCase: ResetDriversUseCase,
    @Inject(UpdateDriverStatusUseCase)
    private readonly updateDriverStatusUseCase: UpdateDriverStatusUseCase
  ) {}

  @Get()
  list() {
    return this.listDriversUseCase.execute();
  }

  @Post()
  create(@Body() body: CreateDriverInput) {
    return this.createDriverUseCase.execute(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: DriverStatus) {
    return this.updateDriverStatusUseCase.execute(id, status);
  }

  @Post('reset')
  reset() {
    return this.resetDriversUseCase.execute();
  }
}
