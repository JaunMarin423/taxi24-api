import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheck, 
  HealthCheckService, 
  HealthIndicatorResult,
  HealthIndicatorStatus
} from '@nestjs/terminus';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiExcludeEndpoint()
  check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => ({
        app: {
          status: 'up' as HealthIndicatorStatus,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        }
      })
    ]);
  }
}
