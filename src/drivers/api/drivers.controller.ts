import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDriverInput, CreateDriverUseCase } from '../application/create-driver.use-case';
import { ListDriversUseCase } from '../application/list-drivers.use-case';
import { ResetDriversUseCase } from '../application/reset-drivers.use-case';

@ApiTags('drivers')
@Controller('api/v1/drivers')
export class DriversController {
  constructor(
    @Inject(CreateDriverUseCase)
    private readonly createDriverUseCase: CreateDriverUseCase,
    @Inject(ListDriversUseCase)
    private readonly listDriversUseCase: ListDriversUseCase,
    @Inject(ResetDriversUseCase)
    private readonly resetDriversUseCase: ResetDriversUseCase
  ) {}

  @Get()
  list() {
    return this.listDriversUseCase.execute();
  }

  @Post()
  create(@Body() body: CreateDriverInput) {
    return this.createDriverUseCase.execute(body);
  }

  @Post('reset')
  reset() {
    return this.resetDriversUseCase.execute();
  }
}
