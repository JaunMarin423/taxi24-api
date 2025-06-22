import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../schemas/user.schema';

class UserResponse {
  _id!: string;
  name!: string;
  email!: string;
  telefono!: string;
  ubicacion!: {
    type: string;
    coordinates: number[];
  };
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}

/**
 * Controlador para la gestión de usuarios en el sistema Taxi24.
 * Permite realizar operaciones CRUD sobre los usuarios del sistema.
 */
@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiResponse({ status: 500, description: 'Error interno del servidor' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios', 
    description: 'Retorna una lista de todos los usuarios registrados' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios',
    type: [UserResponse]
  })
  async findAll(): Promise<UserResponse[]> {
    try {
      const users = await this.userService.findAll();
      return users.map(user => new UserResponse(this.mapToUserResponse(user)));
    } catch (error) {
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un usuario por ID', 
    description: 'Retorna los detalles de un usuario específico' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario a buscar',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado', 
    type: UserResponse 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    try {
      const user = await this.userService.findOne(id);
      return new UserResponse(this.mapToUserResponse(user));
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al buscar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Helper para mapear la respuesta del usuario
  private mapToUserResponse(user: any): Partial<UserResponse> {
    return {
      _id: user._id?.toString(),
      name: user.name,
      email: user.email,
      telefono: user.telefono,
      ubicacion: user.ubicacion,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}