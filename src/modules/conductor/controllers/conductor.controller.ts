import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param, 
  ParseFloatPipe, 
  ParseIntPipe, 
  NotFoundException, 
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery, 
  ApiBody, 
  ApiParam,
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  getSchemaPath
} from '@nestjs/swagger';
import { ConductorService } from '../services/conductor.service';
import { CrearConductorDto } from '../dtos/crear-conductor.dto';
import { Conductor } from '../schemas/conductor.schema';

/**
 * Controlador para la gestión completa de conductores en el sistema Taxi24.
 * Permite realizar operaciones CRUD sobre los conductores, incluyendo búsqueda por ubicación y disponibilidad.
 * 
 * @class ConductorController
 * @public
 */
@ApiTags('Conductores')
@Controller('conductores')
@ApiExtraModels(Conductor)
@ApiResponse({ status: 500, description: 'Error interno del servidor' })
export class ConductorController {
  constructor(private readonly conductorService: ConductorService) {}

  /**
   * Crea un nuevo conductor en el sistema
   * @param crearConductorDto Datos del conductor a crear
   * @returns Conductor creado
   */
  @Post()
  @ApiOperation({ 
    summary: 'Crear conductor',
    description: 'Registra un nuevo conductor en el sistema con los datos proporcionados. Se validará que el email sea único en el sistema.'
  })
  @ApiBody({
    description: 'Datos del conductor a crear',
    examples: {
      ejemplo1: {
        summary: 'Creación básica',
        description: 'Crea un conductor con los datos mínimos requeridos',
        value: {
          nombre: 'Juan Pérez',
          email: 'juan.perez@ejemplo.com',
          telefono: '+1234567890',
          ubicacion: {
            type: 'Point',
            coordinates: [-74.5, 40.0]
          },
          vehiculo: {
            placa: 'ABC123',
            modelo: 'Toyota Corolla',
            color: 'Blanco'
          }
        }
      },
      ejemplo2: {
        summary: 'Conductor disponible',
        description: 'Crea un conductor marcado como disponible',
        value: {
          nombre: 'María García',
          email: 'maria.garcia@ejemplo.com',
          telefono: '+1987654321',
          disponible: true,
          ubicacion: {
            type: 'Point',
            coordinates: [-74.6, 40.1]
          },
          vehiculo: {
            placa: 'XYZ789',
            modelo: 'Honda Civic',
            color: 'Negro',
            anio: 2022
          },
          calificacionPromedio: 4.8
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    description: 'El conductor ha sido creado exitosamente',
    type: Conductor,
    headers: {
      'Location': {
        description: 'URL del recurso creado',
        schema: { type: 'string', format: 'uri' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - El correo electrónico ya está registrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'El correo electrónico ya está registrado',
        error: 'Conflict'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o incompletos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'nombre debe ser una cadena de texto',
          'email debe ser un correo electrónico válido',
          'La ubicación debe ser un punto GeoJSON válido'
        ],
        error: 'Bad Request',
        timestamp: '2023-01-01T00:00:00.000Z',
        path: '/conductores'
      }
    }
  })
  @ApiBody({ 
    type: CrearConductorDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de creación',
        description: 'Ejemplo de datos para crear un conductor',
        value: {
          nombre: 'Juan Pérez',
          email: 'juan.perez@ejemplo.com',
          telefono: '+1234567890',
          ubicacion: {
            type: 'Point',
            coordinates: [-74.5, 40.0]
          },
          disponible: true,
          vehiculo: {
            placa: 'ABC123',
            modelo: 'Toyota Corolla',
            color: 'Blanco'
          }
        }
      }
    }
  })
  async crear(@Body() crearConductorDto: CrearConductorDto) {
    try {
      console.log('Creando conductor con datos:', JSON.stringify(crearConductorDto, null, 2));
      const resultado = await this.conductorService.crear(crearConductorDto);
      console.log('Conductor creado exitosamente:', JSON.stringify(resultado, null, 2));
      return resultado;
    } catch (error) {
      console.error('Error al crear conductor:', error);
      throw error; // Esto permitirá que el filtro de excepciones de NestJS maneje el error
    }
  }

  /**
   * Obtiene todos los conductores registrados en el sistema
   * @returns Lista de conductores
   */
  @Get()
  @ApiOperation({ 
    summary: 'Listar conductores',
    description: `Obtiene todos los conductores registrados en el sistema con soporte para paginación, 
    filtrado y ordenamiento. Los resultados incluyen metadatos de paginación.`,
    parameters: [
      {
        name: 'pagina',
        in: 'query',
        required: false,
        description: 'Número de página para la paginación (por defecto 1, mínimo 1)',
        schema: { type: 'integer', minimum: 1, default: 1, example: 1 }
      },
      {
        name: 'limite',
        in: 'query',
        required: false,
        description: 'Cantidad de resultados por página (por defecto 10, máximo 100)',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10, example: 10 }
      },
      {
        name: 'disponible',
        in: 'query',
        required: false,
        description: 'Filtrar por disponibilidad',
        schema: { type: 'boolean', example: true }
      },
      {
        name: 'ordenarPor',
        in: 'query',
        required: false,
        description: 'Campo por el cual ordenar los resultados',
        schema: { 
          type: 'string', 
          enum: ['nombre', 'email', 'disponible', 'calificacionPromedio', 'createdAt'],
          default: 'nombre',
          example: 'calificacionPromedio'
        }
      },
      {
        name: 'orden',
        in: 'query',
        required: false,
        description: 'Dirección del ordenamiento',
        schema: { 
          type: 'string', 
          enum: ['asc', 'desc'],
          default: 'asc',
          example: 'desc'
        }
      }
    ]
  })
  @ApiOkResponse({
    description: 'Lista paginada de conductores obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Conductor) }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 1 },
            pagina: { type: 'number', example: 1 },
            limite: { type: 'number', example: 10 },
            paginas: { type: 'number', example: 1 }
          }
        }
      }
    }
  })
  @ApiQuery({
    name: 'pagina',
    required: false,
    type: Number,
    description: 'Número de página para la paginación (por defecto 1, mínimo 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por página (por defecto 10, máximo 100)',
    example: 10
  })
  @ApiQuery({
    name: 'ordenarPor',
    required: false,
    enum: ['nombre', 'email', 'disponible', 'calificacionPromedio', 'createdAt'],
    description: 'Campo por el cual ordenar los resultados',
    example: 'nombre'
  })
  @ApiQuery({
    name: 'orden',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Dirección del ordenamiento (ascendente o descendente)',
    example: 'asc'
  })
  async obtenerTodos() {
    return this.conductorService.obtenerTodos();
  }

  /**
   * Obtiene los conductores que están actualmente disponibles
   * @returns Lista de conductores disponibles
   */
  @Get('disponibles')
  @ApiOperation({ 
    summary: 'Listar conductores disponibles',
    description: `Obtiene todos los conductores que están actualmente disponibles para tomar viajes. 
    Útil para mostrar a los pasajeros qué conductores pueden solicitar.`,
    parameters: [
      {
        name: 'ordenarPor',
        in: 'query',
        required: false,
        description: 'Criterio de ordenamiento para los conductores disponibles',
        schema: { 
          type: 'string',
          enum: ['cercania', 'calificacion', 'disponibilidad'],
          default: 'cercania',
          example: 'calificacion'
        }
      }
    ]
  })
  @ApiOkResponse({
    description: 'Lista de conductores disponibles',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 5 },
        conductores: {
          type: 'array',
          items: { $ref: getSchemaPath(Conductor) }
        }
      }
    }
  })
  @ApiResponse({
    status: 204,
    description: 'No hay conductores disponibles actualmente',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 204 },
        message: { type: 'string', example: 'No hay conductores disponibles en este momento' }
      }
    }
  })
  async obtenerDisponibles() {
    return this.conductorService.obtenerDisponibles();
  }

  /**
   * Busca conductores disponibles en un radio determinado desde una ubicación
   * @param lat Latitud de la ubicación de referencia
   * @param lng Longitud de la ubicación de referencia
   * @param distancia Distancia máxima en metros (opcional, por defecto 5000m)
   * @returns Lista de conductores disponibles dentro del radio especificado
   */
  @Get('cercanos')
  @ApiOperation({ 
    summary: 'Buscar conductores cercanos',
    description: `Busca conductores disponibles dentro de un radio determinado desde una ubicación geográfica.
    Utiliza índices geoespaciales para un rendimiento óptimo. Los resultados incluyen la distancia
    a la ubicación de referencia.`,
    parameters: [
      {
        name: 'lat',
        in: 'query',
        required: true,
        description: 'Latitud de la ubicación de referencia (entre -90 y 90 grados)',
        schema: { 
          type: 'number', 
          format: 'float',
          minimum: -90,
          maximum: 90,
          example: 40.7128
        }
      },
      {
        name: 'lng',
        in: 'query',
        required: true,
        description: 'Longitud de la ubicación de referencia (entre -180 y 180 grados)',
        schema: { 
          type: 'number',
          format: 'float',
          minimum: -180,
          maximum: 180,
          example: -74.0060
        }
      },
      {
        name: 'distancia',
        in: 'query',
        required: false,
        description: 'Distancia máxima en metros (mínimo: 100m, máximo: 50000m, por defecto: 5000m)',
        schema: { 
          type: 'integer',
          minimum: 100,
          maximum: 50000,
          default: 5000,
          example: 3000
        }
      },
      {
        name: 'limite',
        in: 'query',
        required: false,
        description: 'Número máximo de conductores a devolver (máximo 20)',
        schema: { 
          type: 'integer',
          minimum: 1,
          maximum: 20,
          default: 10,
          example: 5
        }
      }
    ]
  })
  @ApiQuery({ 
    name: 'lat', 
    required: true, 
    type: 'number', 
    description: 'Latitud de la ubicación de referencia (entre -90 y 90 grados)',
    example: 40.7128,
    schema: { type: 'number', minimum: -90, maximum: 90 }
  })
  @ApiQuery({ 
    name: 'lng', 
    required: true, 
    type: 'number', 
    description: 'Longitud de la ubicación de referencia (entre -180 y 180 grados)',
    example: -74.0060,
    schema: { type: 'number', minimum: -180, maximum: 180 }
  })
  @ApiQuery({ 
    name: 'distancia', 
    required: false, 
    type: 'integer', 
    description: 'Distancia máxima en metros (mínimo: 100m, máximo: 50000m, por defecto: 5000m)',
    example: 3000,
    schema: { type: 'integer', minimum: 100, maximum: 50000, default: 5000 }
  })
  @ApiOkResponse({
    description: 'Lista de conductores disponibles dentro del radio especificado',
    schema: {
      type: 'object',
      properties: {
        ubicacionReferencia: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'Point' },
            coordinates: { 
              type: 'array',
              items: { type: 'number' },
              example: [-74.0060, 40.7128]
            }
          }
        },
        radioMetros: { type: 'number', example: 3000 },
        total: { type: 'number', example: 3 },
        conductores: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              conductor: { $ref: getSchemaPath(Conductor) },
              distancia: { 
                type: 'object',
                properties: {
                  valor: { type: 'number', example: 1234.56 },
                  unidad: { type: 'string', example: 'metros' }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de consulta inválidos',
    schema: {
      oneOf: [
        {
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Las coordenadas proporcionadas no son válidas' },
            error: { type: 'string', example: 'Bad Request' }
          }
        },
        {
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'La distancia debe ser un número entre 100 y 50000' },
            error: { type: 'string', example: 'Bad Request' }
          }
        }
      ]
    }
  })
  async obtenerCercanos(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('distancia', new ParseIntPipe({ optional: true })) distancia = 5000
  ) {
    return this.conductorService.obtenerCercanos(lat, lng, distancia);
  }

  /**
   * Obtiene los detalles de un conductor específico por su ID
   * @param id ID único del conductor
   * @returns Detalles del conductor solicitado
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener conductor por ID',
    description: `Obtiene los detalles completos de un conductor específico utilizando su ID único.
    Incluye información del vehículo, ubicación actual y estado de disponibilidad.`,
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID único de 24 caracteres hexadecimales del conductor',
        schema: {
          type: 'string',
          pattern: '^[0-9a-fA-F]{24}$',
          example: '507f1f77bcf86cd799439011'
        },
        examples: {
          ejemplo1: {
            summary: 'Conductor existente',
            value: '507f1f77bcf86cd799439011'
          },
          ejemplo2: {
            summary: 'ID inválido',
            value: 'id-invalido',
            description: 'Generará un error 400'
          }
        }
      }
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID único de 24 caracteres hexadecimales del conductor',
    example: '507f1f77bcf86cd799439011',
    schema: { 
      type: 'string',
      pattern: '^[0-9a-fA-F]{24}$',
      minLength: 24,
      maxLength: 24
    }
  })
  @ApiOkResponse({
    description: 'Detalles del conductor encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(Conductor) },
        {
          properties: {
            viajeActivo: {
              type: 'object',
              description: 'Información del viaje activo del conductor (si existe)',
              properties: {
                id: { type: 'string', example: '507f1f77bcf86cd799439012' },
                estado: { type: 'string', example: 'en_curso' },
                fechaInicio: { type: 'string', format: 'date-time' }
              }
            },
            estadisticas: {
              type: 'object',
              properties: {
                totalViajes: { type: 'number', example: 42 },
                calificacionPromedio: { type: 'number', example: 4.8 },
                viajesUltimoMes: { type: 'number', example: 15 }
              }
            }
          }
        }
      ]
    }
  })
  @ApiNotFoundResponse({
    description: 'Conductor no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'No se encontró ningún conductor con el ID proporcionado' },
        error: { type: 'string', example: 'Not Found' },
        resourceId: { type: 'string', example: '507f1f77bcf86cd799439011' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'ID con formato inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'El ID proporcionado no es válido' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async obtenerPorId(@Param('id') id: string) {
    // Validar formato del ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new BadRequestException('ID de conductor no válido');
    }
    
    const conductor = await this.conductorService.obtenerPorId(id);
    if (!conductor) {
      throw new NotFoundException({
        statusCode: 404,
        message: `No se encontró ningún conductor con el ID: ${id}`,
        error: 'Not Found',
        resourceId: id
      });
    }
    return conductor;
  }
}
