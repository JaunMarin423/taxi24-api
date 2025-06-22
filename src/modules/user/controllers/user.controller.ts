import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseFloatPipe,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User, IUser, ILocation } from '../schemas/user.schema';

interface UserResponseData {
  _id: string;
  name: string;
  nombre: string; // Asegurar que el campo 'nombre' esté presente
  email: string;
  telefono: string;
  ubicacion: ILocation;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Respuesta de la API para operaciones de pasajeros
 */
class UserResponse {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: {
    type: string;
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserResponseData) {
    this._id = user._id;
    this.nombre = user.name; // Mapear name a nombre
    this.email = user.email;
    this.telefono = user.telefono;
    this.ubicacion = user.ubicacion;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

/**
 * Controlador para la gestión de pasajeros en el sistema Taxi24.
 * Permite realizar operaciones CRUD sobre los pasajeros del sistema.
 */
@ApiTags('Pasajeros')
@Controller('pasajeros')
@UseInterceptors(ClassSerializerInterceptor)
@ApiResponse({ status: 500, description: 'Error interno del servidor' })
@ApiExtraModels(UserResponse)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  /**
   * Crea un nuevo pasajero en el sistema
   * @param createUserDto Datos del pasajero a crear
   * @returns Pasajero creado
   */
  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo pasajero',
    description: 'Crea un nuevo registro de pasajero en el sistema.'
  })
  @ApiCreatedResponse({ 
    description: 'Pasajero creado exitosamente',
    type: UserResponse,
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '+1234567890',
        ubicacion: {
          type: 'Point',
          coordinates: [-74.5, 40.0]
        },
        createdAt: '2023-06-22T15:42:11.000Z',
        updatedAt: '2023-06-22T15:42:11.000Z'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o incompletos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['El nombre es requerido', 'El email no es válido'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiConflictResponse({ 
    description: 'El correo electrónico ya está registrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'El correo electrónico ya está registrado' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'Datos del pasajero a crear',
    examples: {
      example1: {
        summary: 'Ejemplo de creación de pasajero',
        value: {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'Password123',
          telefono: '+1234567890',
          ubicacion: {
            type: 'Point',
            coordinates: [-74.5, 40.0]
          }
        }
      }
    }
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      this.logger.log(`Intentando crear usuario con email: ${createUserDto.email}`);
      
      if (createUserDto.ubicacion) {
        try {
          createUserDto.ubicacion.validate();
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Error de validación de coordenadas';
          throw new BadRequestException(message);
        }
      }
      
      const user = await this.userService.create(createUserDto);
      this.logger.log(`Usuario creado exitosamente con ID: ${user._id}`);
      
      const response = this.mapToUserResponse(user);
      // Asegurarse de que el campo 'nombre' esté presente
      (response as any).nombre = response.name;
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(`Error al crear usuario: ${errorMessage}`, errorStack);
      
      // Si el error ya es un HttpException, lo relanzamos
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Para cualquier otro error, lanzamos un error interno del servidor
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }

  /**
   * Obtiene todos los pasajeros registrados
   * @returns Lista de pasajeros
   */
  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los pasajeros', 
    description: 'Retorna una lista de todos los pasajeros registrados' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pasajeros',
    type: [UserResponse]
  })
  async findAll(): Promise<UserResponse[]> {
    try {
      const users = await this.userService.findAll();
      return users.map(user => {
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        return new UserResponse({
          _id: userObj._id.toString(),
          name: userObj.name,
          nombre: userObj.name, // Incluir el campo 'nombre'
          email: userObj.email,
          telefono: userObj.telefono,
          ubicacion: userObj.ubicacion,
          createdAt: userObj.createdAt,
          updatedAt: userObj.updatedAt
        });
      });
    } catch (error) {
      throw new HttpException(
        'Error al obtener los pasajeros',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene un pasajero por su ID
   * @param id ID del pasajero
   * @returns Información del pasajero
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un pasajero por ID', 
    description: 'Obtiene la información detallada de un pasajero específico' 
  })
  @ApiParam({ name: 'id', description: 'ID del pasajero' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del pasajero',
    type: UserResponse
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pasajero no encontrado'
  })
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      return new UserResponse({
        _id: userObj._id.toString(),
        name: userObj.name,
        nombre: userObj.name, // Incluir el campo 'nombre'
        email: userObj.email,
        telefono: userObj.telefono,
        ubicacion: userObj.ubicacion,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el pasajero',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Busca conductores cercanos a una ubicación
   * @param latitud Latitud de la ubicación
   * @param longitud Longitud de la ubicación
   * @param radio Radio de búsqueda en kilómetros (opcional, por defecto 3km)
   * @returns Lista de conductores cercanos
   */
  @Get('cercanos')
  @ApiOperation({ 
    summary: 'Buscar conductores cercanos', 
    description: 'Encuentra conductores disponibles en un radio de 3km desde la ubicación proporcionada' 
  })
  @ApiQuery({ name: 'latitud', required: true, type: Number, description: 'Latitud de la ubicación' })
  @ApiQuery({ name: 'longitud', required: true, type: Number, description: 'Longitud de la ubicación' })
  @ApiQuery({ name: 'radio', required: false, type: Number, description: 'Radio de búsqueda en kilómetros (opcional, por defecto 3km)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de conductores cercanos',
    type: [Object]
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parámetros de ubicación inválidos'
  })
  async findNearbyDrivers(
    @Query('latitud', ParseFloatPipe) latitud: number,
    @Query('longitud', ParseFloatPipe) longitud: number,
    @Query('radio') radio?: number
  ) {
    try {
      // Validar coordenadas
      if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
        throw new BadRequestException('Coordenadas inválidas');
      }
      
      const maxDistance = radio ? radio * 1000 : 3000; // Convertir km a metros
      return this.userService.findNearbyDrivers(latitud, longitud, maxDistance);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al buscar conductores cercanos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Mapea un documento de usuario a la respuesta de la API
   * @param user Documento de usuario de MongoDB
   * @returns Objeto de respuesta del usuario
   */
  private mapToUserResponse(user: IUser): UserResponseData {
    // Asegurarse de que el _id sea una cadena
    const userId = typeof user._id === 'object' && '_id' in user._id 
      ? user._id.toString() 
      : String(user._id);
      
    return {
      _id: userId,
      name: user.name,
      nombre: user.name, // Incluir el campo 'nombre' con el mismo valor que 'name'
      email: user.email,
      telefono: user.telefono,
      ubicacion: user.ubicacion,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}