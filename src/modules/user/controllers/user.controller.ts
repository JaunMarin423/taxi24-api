import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseFloatPipe,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiExtraModels
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User, IUser, ILocation } from '../schemas/user.schema';

interface UserResponseData {
  _id: string;
  name: string;
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
  constructor(private readonly userService: UserService) {}

  /**
   * Crea un nuevo pasajero en el sistema
   * @param createUserDto Datos del pasajero a crear
   * @returns Pasajero creado
   */
  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo pasajero', 
    description: 'Crea un nuevo registro de pasajero en el sistema' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Pasajero creado exitosamente',
    type: UserResponse
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos'
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const user = await this.userService.create(createUserDto);
      return new UserResponse(this.mapToUserResponse(user));
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al crear el pasajero',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
        throw new HttpException('Pasajero no encontrado', HttpStatus.NOT_FOUND);
      }
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      return new UserResponse({
        _id: userObj._id.toString(),
        name: userObj.name,
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
    const userObj = (user as any).toObject ? (user as any).toObject() : user;
    return {
      _id: userObj._id.toString(),
      name: userObj.name,
      email: userObj.email,
      telefono: userObj.telefono,
      ubicacion: userObj.ubicacion,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt
    };
  }
}