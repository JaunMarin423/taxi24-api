import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ViajeModule } from './modules/viaje/viaje.module';
import { ConductorModule } from './modules/conductor/conductor.module';
import { FacturaModule } from './modules/factura/factura.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ViajeModule,
    ConductorModule,
    FacturaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}