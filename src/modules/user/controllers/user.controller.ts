import { Controller, Get, Post, Body, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiQuery,
  ApiParam,
  getSchemaPath
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../schemas/user.schema';

/**
 * Controlador para la gestión de usuarios en el sistema Taxi24.
 * Permite realizar operaciones CRUD sobre los usuarios del sistema.
 */
@ApiTags('usuarios')
@Controller('users')
@ApiResponse({ status: 500, description: 'Error interno del servidor' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario',
    description: 'Registra un nuevo usuario en el sistema con los datos proporcionados. Se validará que el email sea único.'
  })
  @ApiBody({
    description: 'Datos del usuario a crear',
    examples: {
      ejemplo1: {
        summary: 'Creación básica',
        description: 'Crea un usuario con los datos mínimos requeridos',
        value: {
          name: 'Juan Pérez',
          email: 'juan.perez@ejemplo.com',
          password: 'ContraseñaSegura123!',
          telefono: '+1234567890',
          ubicacion: {
            type: 'Point',
            coordinates: [-74.5, 40.0]
          }
        }
      },
      ejemplo2: {
        summary: 'Usuario con datos adicionales',
        description: 'Crea un usuario con todos los campos disponibles',
        value: {
          name: 'María García',
          email: 'maria.garcia@ejemplo.com',
          password: 'OtraContraseña123!',
          telefono: '+1987654321',
          ubicacion: {
            type: 'Point',
            coordinates: [-74.6, 40.1]
          },
          direccion: 'Calle Falsa 123',
          preferencias: {
            notificaciones: true,
            temaOscuro: false
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'El usuario ha sido creado exitosamente',
    headers: {
      'Location': {
        description: 'URL del usuario creado',
        schema: { type: 'string', format: 'uri' }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name debe ser una cadena de texto',
          'email debe ser un correo electrónico válido',
          'password debe tener al menos 8 caracteres'
        ],
        error: 'Bad Request'
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
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Obtiene una lista paginada de todos los usuarios registrados en el sistema',
    parameters: [
      {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Número de página (por defecto 1)',
        schema: { type: 'integer', minimum: 1, default: 1, example: 1 }
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Cantidad de resultados por página (máximo 100)',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10, example: 10 }
      },
      {
        name: 'search',
        in: 'query',
        required: false,
        description: 'Término de búsqueda para filtrar usuarios',
        schema: { type: 'string', example: 'juan' }
      }
    ]
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(User) }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 1 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 1 }
          }
        }
      }
    }
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}