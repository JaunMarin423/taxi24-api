import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViajeController } from './controllers/viaje.controller';
import { ViajeService } from './services/viaje.service';
import { ViajeMongoRepository } from '@infrastructure/repositories/viaje-mongo.repository';
import { CrearViajeUseCase } from '@domain/use-cases/crear-viaje.use-case';
import { ViajeRepository } from '@domain/repositories/viaje.repository';
import { Viaje, ViajeSchema } from '@infrastructure/schemas/viaje.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Viaje.name, schema: ViajeSchema }]),
  ],
  controllers: [ViajeController],
  providers: [
    ViajeService,
    {
      provide: CrearViajeUseCase,
      useFactory: (viajeRepo: ViajeRepository) => {
        return new CrearViajeUseCase(viajeRepo);
      },
      inject: ['ViajeRepository']
    },
    {
      provide: 'ViajeRepository',
      useClass: ViajeMongoRepository,
    },
  ],
  exports: [ViajeService],
})
export class ViajeModule {}
