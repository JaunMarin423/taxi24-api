import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { Conductor as ConductorSchema } from '../schemas/conductor.schema';
import { Conductor as ConductorEntity } from '../../../domain/entities/conductor.entity';
import { ConductorRepository } from '../../../domain/repositories/conductor.repository';
import { Ubicacion } from '../../../domain/value-objects/ubicacion.value-object';
import { CrearConductorDto } from '../dtos/crear-conductor.dto';
import { ConductorMapper } from '../mappers/conductor.mapper';

@Injectable()
export class ConductorService {
  private readonly logger = new Logger(ConductorService.name);

  constructor(
    @Inject('ConductorRepository')
    private readonly conductorRepository: ConductorRepository,
  ) {}

  async obtenerTodos(): Promise<ConductorEntity[]> {
    try {
      console.log('Obteniendo todos los conductores...');
      const conductores = await this.conductorRepository.obtenerTodos() as unknown as ConductorSchema[];
      
      if (!Array.isArray(conductores)) {
        console.error('La respuesta de obtenerTodos no es un arreglo:', conductores);
        return [];
      }
      
      console.log(`Se encontraron ${conductores.length} conductores`);
      
      // Usar una aserción de tipo para manejar el caso de nulos
      return conductores.reduce<ConductorEntity[]>((validos, conductor: ConductorSchema) => {
        try {
          if (!conductor) {
            console.warn('Conductor nulo o indefinido encontrado');
            return validos;
          }
          
          const mapped = ConductorMapper.toEntity(conductor);
          if (!mapped) {
            const conductorId = conductor._id ? conductor._id.toString() : 'ID no disponible';
            console.warn('No se pudo mapear el conductor:', conductorId);
            return validos;
          }
          
          return [...validos, mapped];
        } catch (error) {
          console.error('Error al mapear conductor:', error);
          return validos;
        }
      }, []);
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      throw new Error('Error al obtener los conductores');
    }
  }

  async obtenerDisponibles(): Promise<ConductorEntity[]> {
    try {
      const conductores = await this.conductorRepository.obtenerDisponibles() as unknown as ConductorSchema[];
      
      if (!Array.isArray(conductores)) {
        this.logger.error('La respuesta de obtenerDisponibles no es un arreglo:', conductores);
        return [];
      }
      
      return conductores.reduce<ConductorEntity[]>((validos, conductor) => {
        try {
          if (!conductor) {
            this.logger.warn('Conductor nulo o indefinido encontrado en obtenerDisponibles');
            return validos;
          }
          
          const mapped = ConductorMapper.toEntity(conductor);
          if (!mapped) {
            const conductorId = conductor._id ? conductor._id.toString() : 'ID no disponible';
            this.logger.warn('No se pudo mapear el conductor en obtenerDisponibles:', conductorId);
            return validos;
          }
          
          return [...validos, mapped];
        } catch (error) {
          this.logger.error('Error al mapear conductor en obtenerDisponibles:', error);
          return validos;
        }
      }, []);
    } catch (error) {
      this.logger.error('Error en obtenerDisponibles:', error);
      throw new Error('Error al obtener los conductores disponibles');
    }
  }

  async obtenerCercanos(lat: number, lng: number, distancia: number = 5000): Promise<ConductorEntity[]> {
    try {
      const ubicacion = new Ubicacion(lat, lng);
      const conductores = await this.conductorRepository.obtenerCercanos(ubicacion, distancia) as unknown as ConductorSchema[];
      
      if (!Array.isArray(conductores)) {
        this.logger.error('La respuesta de obtenerCercanos no es un arreglo:', conductores);
        return [];
      }
      
      return conductores.reduce<ConductorEntity[]>((validos, conductor) => {
        try {
          if (!conductor) {
            this.logger.warn('Conductor nulo o indefinido encontrado en obtenerCercanos');
            return validos;
          }
          
          const mapped = ConductorMapper.toEntity(conductor);
          if (!mapped) {
            const conductorId = conductor._id ? conductor._id.toString() : 'ID no disponible';
            this.logger.warn('No se pudo mapear el conductor en obtenerCercanos:', conductorId);
            return validos;
          }
          
          return [...validos, mapped];
        } catch (error) {
          this.logger.error('Error al mapear conductor en obtenerCercanos:', error);
          return validos;
        }
      }, []);
    } catch (error) {
      this.logger.error('Error en obtenerCercanos:', error);
      throw new Error('Error al obtener los conductores cercanos');
    }
  }

  async obtenerPorId(id: string): Promise<ConductorEntity | null> {
    try {
      const conductor = await this.conductorRepository.obtenerPorId(id) as unknown as ConductorSchema | null;
      
      if (!conductor) {
        this.logger.warn(`Conductor con ID "${id}" no encontrado`);
        throw new NotFoundException(`Conductor con ID "${id}" no encontrado`);
      }
      
      const mapped = ConductorMapper.toEntity(conductor);
      if (!mapped) {
        const conductorId = conductor._id ? conductor._id.toString() : 'ID no disponible';
        this.logger.error(`No se pudo mapear el conductor con ID: ${conductorId}`);
        throw new Error('Error al procesar los datos del conductor');
      }
      
      return mapped;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al obtener el conductor con ID ${id}:`, error);
      throw new Error('Error al obtener el conductor');
    }
  }

  async crear(crearConductorDto: CrearConductorDto): Promise<ConductorEntity> {
    try {
      console.log('Iniciando creación de conductor con datos:', JSON.stringify(crearConductorDto, null, 2));
      
      // Validar que existe el objeto ubicación
      if (!crearConductorDto.ubicacion || !crearConductorDto.ubicacion.coordinates) {
        throw new Error('La ubicación es requerida');
      }
      
      // Extraer y validar coordenadas
      const [longitud, latitud] = crearConductorDto.ubicacion.coordinates;
      
      if (typeof latitud !== 'number' || typeof longitud !== 'number') {
        throw new Error('Las coordenadas deben ser números válidos');
      }
      
      // Validar rangos de coordenadas
      if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
        throw new Error('Coordenadas fuera de rango: latitud debe estar entre -90 y 90, longitud entre -180 y 180');
      }
      
      console.log('Coordenadas validadas:', { latitud, longitud });
      
      // Crear la ubicación con los valores validados
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
        crearConductorDto.vehiculo ? {
          placa: crearConductorDto.vehiculo.placa,
          modelo: crearConductorDto.vehiculo.modelo,
          color: crearConductorDto.vehiculo.color
        } : undefined
      );

      console.log('Entidad Conductor creada:', {
        ...conductor,
        ubicacion: { 
          latitud: conductor.ubicacion.latitud, 
          longitud: conductor.ubicacion.longitud 
        }
      });

      // Convertir a esquema de MongoDB
      const conductorSchema = ConductorMapper.toSchema(conductor);
      console.log('Esquema a guardar en MongoDB:', JSON.stringify(conductorSchema, null, 2));
      
      // Guardar en la base de datos
      const resultado = await this.conductorRepository.guardar(conductor as any);
      console.log('Conductor guardado exitosamente');
      
      return resultado;
    } catch (error) {
      console.error('Error en ConductorService.crear:', error);
      throw error;
    }
  }
}
