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
 * @class UserResponse
 * @description Representa la respuesta estandarizada para operaciones de usuarios
 */
class UserResponse {
  /**
   * ID único del usuario
   * @example '507f1f77bcf86cd799439011'
   */
  _id: string;

  /**
   * Nombre completo del usuario
   * @example 'Juan Pérez'
   */
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
@ApiTags('Users')
@Controller('users')
@ApiExtraModels(UserResponse)
@UseInterceptors(ClassSerializerInterceptor)
@ApiResponse({ status: 500, description: 'Error interno del servidor' })
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
    summary: 'Create a new user',
    description: 'Registers a new user in the system with the provided information.'
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: UserResponse
  })
  @ApiBadRequestResponse({
    description: 'Invalid or incomplete input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['El correo electrónico es obligatorio', 'La contraseña debe tener al menos 8 caracteres'],
        error: 'Bad Request'
      }
    }
  })
  @ApiConflictResponse({
    description: 'El correo electrónico ya está registrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'El correo electrónico ya está registrado',
        error: 'Conflict'
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
      (response as any).nombre = response.name;
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(`Error al crear usuario: ${errorMessage}`, errorStack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }

  /**
   * Obtiene todos los usuarios registrados
   * @returns Lista de usuarios
   */
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users registered in the system.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para la paginación',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [UserResponse],
    headers: {
      'X-Total-Count': {
        description: 'Número total de usuarios',
        schema: { type: 'integer' }
      },
      'X-Page': {
        description: 'Página actual',
        schema: { type: 'integer' }
      },
      'X-Total-Pages': {
        description: 'Número total de páginas',
        schema: { type: 'integer' }
      }
    }
  })
  async findAll(): Promise<UserResponse[]> {
    try {
      const users = await this.userService.findAll();
      return users.map(user => {
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        return new UserResponse({
          _id: userObj._id.toString(),
          name: userObj.name,
          nombre: userObj.name, 
          email: userObj.email,
          telefono: userObj.telefono,
          ubicacion: userObj.ubicacion,
          createdAt: userObj.createdAt,
          updatedAt: userObj.updatedAt
        });
      });
    } catch (error) {
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Información del usuario
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Finds and returns information for a specific user using their unique ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID único del usuario',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del usuario',
    type: UserResponse
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'No se encontró el usuario con el ID especificado',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
    schema: {
      example: {
        statusCode: 400,
        message: 'ID de usuario inválido',
        error: 'Bad Request'
      }
    }
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
        nombre: userObj.name, 
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
        'Error al obtener el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Busca conductores cercanos a una ubicación
   * @param latitud Latitud de la ubicación
   * @param longitud Longitud de la ubicación
   * @param radio Radio de búsqueda en metros (opcional, por defecto 3000m)
   * @returns Lista de conductores cercanos
   */
  @Get('cercanos')
  @ApiOperation({
    summary: 'Find nearby drivers',
    description: 'Finds available drivers within a 3 km radius from the provided location.'
  })
  @ApiQuery({
    name: 'latitud',
    type: Number,
    required: true,
    description: 'Latitud de la ubicación de búsqueda',
    example: 40.7128
  })
  @ApiQuery({
    name: 'longitud',
    type: Number,
    required: true,
    description: 'Longitud de la ubicación de búsqueda',
    example: -74.0060
  })
  @ApiQuery({
    name: 'radio',
    type: Number,
    required: false,
    description: 'Radio de búsqueda en metros (máximo 10000m)',
    example: 3000
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores cercanos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          nombre: { type: 'string', example: 'Carlos López' },
          email: { type: 'string', example: 'carlos@taxi24.com' },
          telefono: { type: 'string', example: '+1234567890' },
          distancia: { type: 'number', example: 1234.56, description: 'Distancia en metros desde la ubicación de búsqueda' },
          ubicacion: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'Point' },
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                example: [-74.0060, 40.7128]
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de ubicación inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['latitud debe ser una cadena de coordenadas válida'],
        error: 'Bad Request'
      }
    }
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