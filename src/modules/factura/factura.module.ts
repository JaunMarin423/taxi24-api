import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacturaController } from './controllers/factura.controller';
import { FacturaService } from './services/factura.service';
import { ViajeModule } from '../viaje/viaje.module';
import { FacturaMongoRepository } from '@infrastructure/repositories/factura-mongo.repository';
import { Factura, FacturaSchema } from '@infrastructure/schemas/factura.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Factura.name, schema: FacturaSchema }]),
    forwardRef(() => ViajeModule),
  ],
  controllers: [FacturaController],
  providers: [
    FacturaService,
    {
      provide: 'FacturaRepository',
      useClass: FacturaMongoRepository,
    },
  ],
  exports: [FacturaService],
})
export class FacturaModule {}
