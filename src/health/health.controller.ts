import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheck, 
  HealthCheckService, 
  HealthIndicatorResult,
  HealthIndicatorStatus
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
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
