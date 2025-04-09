import { Controller, Get } from '@nestjs/common';
import {
  TypeOrmHealthIndicator,
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';
import { SkipAuth } from './decorators';

@SkipAuth()
@Controller()
export class AppController {
  constructor(
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly health: HealthCheckService,
  ) {}

  @Get('/health')
  @HealthCheck()
  async healthChecks() {
    const data = await this.health.check([
      () => this.typeOrmHealthIndicator.pingCheck('database'),
    ]);

    return data;
  }
}
