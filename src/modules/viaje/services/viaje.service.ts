import { Injectable } from '@nestjs/common';
import { CrearViajeUseCase } from '../../../domain/use-cases/crear-viaje.use-case';
import { ViajeMongoRepository } from '../../../infrastructure/repositories/viaje-mongo.repository';

@Injectable()
export class ViajeService {
  private crearViajeUseCase: CrearViajeUseCase;

  constructor() {
    // Aquí se instancia el caso de uso con la implementación del repositorio
    this.crearViajeUseCase = new CrearViajeUseCase(new ViajeMongoRepository());
  }

  async crearViaje(data: { id: string; stado: boolean; conductor: boolean }) {
    return this.crearViajeUseCase.execute(data);
  }
}