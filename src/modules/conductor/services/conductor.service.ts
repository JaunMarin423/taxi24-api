import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Conductor as ConductorSchema } from '../schemas/conductor.schema';
import { Conductor as ConductorEntity } from '../../../domain/entities/conductor.entity';
import { ConductorRepository } from '../../../domain/repositories/conductor.repository';
import { Ubicacion } from '../../../domain/value-objects/ubicacion.value-object';
import { CrearConductorDto } from '../dtos/crear-conductor.dto';
import { ConductorMapper } from '../mappers/conductor.mapper';

@Injectable()
export class ConductorService {
  constructor(
    @Inject('ConductorRepository')
    private readonly conductorRepository: ConductorRepository,
  ) {}

  async obtenerTodos(): Promise<ConductorEntity[]> {
    const conductores = await this.conductorRepository.obtenerTodos();
    return conductores.map((conductor) => ConductorMapper.toEntity(conductor as any));
  }

  async obtenerDisponibles(): Promise<ConductorEntity[]> {
    const conductores = await this.conductorRepository.obtenerDisponibles();
    return conductores.map((conductor) => ConductorMapper.toEntity(conductor as any));
  }

  async obtenerCercanos(lat: number, lng: number, distancia: number = 5000): Promise<ConductorEntity[]> {
    const ubicacion = new Ubicacion(lat, lng);
    const conductores = await this.conductorRepository.obtenerCercanos(ubicacion, distancia);
    return conductores.map((conductor) => ConductorMapper.toEntity(conductor as any));
  }

  async obtenerPorId(id: string): Promise<ConductorEntity | null> {
    const conductor = await this.conductorRepository.obtenerPorId(id);
    if (!conductor) {
      throw new NotFoundException(`Conductor con ID "${id}" no encontrado`);
    }
    return ConductorMapper.toEntity(conductor as any);
  }

  async crear(crearConductorDto: CrearConductorDto): Promise<ConductorEntity> {
    try {
      // Validar que las coordenadas sean números
      const [longitud, latitud] = crearConductorDto.ubicacion.coordinates;
      
      if (isNaN(latitud) || isNaN(longitud)) {
        throw new Error('Las coordenadas deben ser números válidos');
      }
      
      const ubicacion = new Ubicacion(latitud, longitud);
      
      // Crear una nueva entidad de conductor
      const conductor = new ConductorEntity(
        '', // ID será generado por MongoDB
        crearConductorDto.nombre,
        crearConductorDto.email,
        crearConductorDto.telefono,
        ubicacion,
        crearConductorDto.disponible ?? true, // Valor por defecto: true
        crearConductorDto.licencia,
        {
          placa: crearConductorDto.vehiculo.placa,
          modelo: crearConductorDto.vehiculo.modelo,
          color: crearConductorDto.vehiculo.color
        }
      );

      // Convertir a esquema de MongoDB y guardar
      const conductorSchema = ConductorMapper.toSchema(conductor);
      const resultado = await this.conductorRepository.guardar(conductorSchema as any);
      
      // Convertir el resultado de vuelta a entidad
      return ConductorMapper.toEntity(resultado as any);
    } catch (error) {
      console.error('Error en ConductorService.crear:', error);
      throw error;
    }
  }
}
