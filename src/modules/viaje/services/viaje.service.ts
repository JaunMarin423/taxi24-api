import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { CrearViajeUseCase, CrearViajeParams } from '../../../domain/use-cases/crear-viaje.use-case';
import { ViajeRepository } from '../../../domain/repositories/viaje.repository';
import { Viaje } from '../../../domain/entities/viaje.entity';
import { CompletarViajeDto } from '../dto/completar-viaje.dto';
import { FacturaService } from '../../factura/services/factura.service';

@Injectable()
export class ViajeService {
  constructor(
    @Inject('ViajeRepository') private viajeRepository: ViajeRepository,
    private crearViajeUseCase: CrearViajeUseCase,
    @Inject(forwardRef(() => FacturaService))
    private facturaService: FacturaService,
  ) {}

  async crearViaje(data: CrearViajeParams) {
    return this.crearViajeUseCase.execute({
      ...data,
      estado: data.estado || 'PENDIENTE',
      fechaInicio: data.fechaInicio || new Date()
    });
  }

  async obtenerViajesActivos(): Promise<Viaje[]> {
    return this.viajeRepository.listarActivos();
  }

  async obtenerViajeActivoPorPasajero(pasajeroId: string): Promise<Viaje | null> {
    return this.viajeRepository.obtenerActivoPorPasajero(pasajeroId);
  }

  async obtenerViajeActivoPorConductor(conductorId: string): Promise<Viaje | null> {
    return this.viajeRepository.obtenerActivoPorConductor(conductorId);
  }

  async obtenerPorId(id: string): Promise<Viaje | null> {
    return this.viajeRepository.obtenerPorId(id);
  }

  async actualizar(viaje: Viaje): Promise<Viaje> {
    return this.viajeRepository.actualizar(viaje);
  }

  async completarViaje(id: string, completarViajeDto: CompletarViajeDto): Promise<{ viaje: Viaje; factura: any }> {
    const viaje = await this.viajeRepository.obtenerPorId(id);
    
    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    try {
      // Usar el método del dominio para completar el viaje
      viaje.completar();
      
      // Actualizar el viaje en la base de datos
      const viajeActualizado = await this.viajeRepository.actualizar(viaje);
      
      // Generar factura automáticamente
      const factura = await this.facturaService.generarFactura(viajeActualizado);
      
      return { viaje: viajeActualizado, factura };
      
    } catch (error: any) {
      throw new BadRequestException(error, error.message);
    }
  }
}