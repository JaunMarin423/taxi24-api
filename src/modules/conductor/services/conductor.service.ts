import { Injectable, Inject } from '@nestjs/common';
import { Conductor } from 'src/domain/entities/conductor.entity';
import { ConductorRepository } from 'src/domain/repositories/conductor.repository';
import { Ubicacion } from 'src/domain/value-objects/ubicacion.value-object';
import { CrearConductorDto } from '../dtos/crear-conductor.dto';

@Injectable()
export class ConductorService {
  constructor(
    @Inject('ConductorRepository')
    private readonly conductorRepository: ConductorRepository,
  ) {}

  async obtenerTodos(): Promise<Conductor[]> {
    return this.conductorRepository.obtenerTodos();
  }

  async obtenerDisponibles(): Promise<Conductor[]> {
    return this.conductorRepository.obtenerDisponibles();
  }

  async obtenerCercanos(lat: number, lng: number, distancia: number = 5000): Promise<Conductor[]> {
    const ubicacion = new Ubicacion(lat, lng);
    return this.conductorRepository.obtenerCercanos(ubicacion, distancia);
  }

  async obtenerPorId(id: string): Promise<Conductor | null> {
    return this.conductorRepository.obtenerPorId(id);
  }

  async crear(crearConductorDto: CrearConductorDto): Promise<Conductor> {
    try {
      // Validar que las coordenadas sean números
      const [longitud, latitud] = crearConductorDto.ubicacion.coordinates;
      
      if (isNaN(latitud) || isNaN(longitud)) {
        throw new Error('Las coordenadas deben ser números válidos');
      }
      
      console.log('Creando ubicación con datos:', {
        latitud,
        longitud,
        type: 'Point'
      });
      
      const ubicacion = new Ubicacion(latitud, longitud);
      
      console.log('Ubicación creada:', {
        type: 'Point',
        coordinates: [longitud, latitud]
      });
      
      // Crear un conductor sin ID para que MongoDB lo genere automáticamente
      const conductor = new Conductor(
        '', // ID vacío para nuevo conductor
        crearConductorDto.nombre,
        crearConductorDto.email,
        crearConductorDto.telefono,
        ubicacion,
        crearConductorDto.disponible,
        crearConductorDto.licencia,
        { 
          placa: crearConductorDto.vehiculo.placa,
          modelo: crearConductorDto.vehiculo.modelo,
          color: crearConductorDto.vehiculo.color
        }
      );

      console.log('Conductor a guardar:', {
        ...conductor,
        ubicacion: {
          type: 'Point',
          coordinates: [conductor.ubicacion['longitud'], conductor.ubicacion['latitud']]
        }
      });

      // Guardar el conductor y devolver el resultado
      const resultado = await this.conductorRepository.guardar(conductor);
      console.log('Resultado de guardar conductor:', resultado);
      return resultado;
    } catch (error) {
      console.error('Error en ConductorService.crear:', error);
      throw error;
    }
  }
}
