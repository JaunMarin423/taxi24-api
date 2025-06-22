import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConductorSchema } from '../../infrastructure/schemas/conductor.schema';
import { ConductorController } from './controllers/conductor.controller';
import { ConductorService } from './services/conductor.service';
import { ConductorMongoRepository } from '../../infrastructure/repositories/conductor-mongo.repository';
import { ConductorRepository } from '../../domain/repositories/conductor.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conductor', schema: ConductorSchema },
    ]),
  ],
  controllers: [ConductorController],
  providers: [
    ConductorService,
    {
      provide: 'ConductorRepository',
      useClass: ConductorMongoRepository,
    },
  ],
  exports: [ConductorService],
})
export class ConductorModule {}
