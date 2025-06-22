import { 
  HttpException, 
  HttpStatus, 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException,
  Logger,
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, IUser } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';

interface NearbyDriversParams {
  latitud: number;
  longitud: number;
  maxDistance: number;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      // Verificar si el correo ya está registrado
      const existingUser = await this.userModel.findOne({ email: createUserDto.email.toLowerCase() }).exec();
      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      // Validar coordenadas
      const [longitude, latitude] = createUserDto.ubicacion.coordinates;
      
      if (isNaN(longitude) || isNaN(latitude)) {
        throw new BadRequestException('Las coordenadas proporcionadas no son válidas');
      }

      // Asegurar que las coordenadas estén en el rango correcto
      if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        throw new BadRequestException('Las coordenadas están fuera de rango');
      }

      // Crear el usuario con la ubicación formateada correctamente
      const userData = {
        ...createUserDto,
        email: createUserDto.email.toLowerCase(),
        ubicacion: {
          type: 'Point',
          coordinates: [
            parseFloat(longitude.toFixed(6)),
            parseFloat(latitude.toFixed(6))
          ]
        },
      };

      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();
      
      // Eliminar la contraseña del objeto de retorno
      const userObject = savedUser.toObject();
      // Usar type assertion para manejar la propiedad password
      const userWithoutPassword = userObject as Omit<typeof userObject, 'password'>;
      delete (userObject as any).password;
      
      return userObject as IUser;
      
    } catch (error: unknown) {
      // Manejo seguro del error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(`Error al crear usuario: ${errorMessage}`, errorStack);
      
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Manejar errores de MongoDB
      if (
        error && 
        typeof error === 'object' && 
        'name' in error && 
        error.name === 'MongoError' && 
        'code' in error && 
        error.code === 11000
      ) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      
      throw new InternalServerErrorException('Error al crear el usuario. Por favor, intente nuevamente.');
    }
  }

  async findAll(): Promise<IUser[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<IUser | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Encuentra conductores disponibles cerca de una ubicación
   * @param latitud Latitud de la ubicación
   * @param longitud Longitud de la ubicación
   * @param maxDistance Distancia máxima en metros
   * @returns Lista de conductores cercanos
   */
  async findNearbyDrivers(
    latitud: number,
    longitud: number,
    maxDistance: number = 3000 // 3km por defecto
  ): Promise<IUser[]> {
    try {
      // Validar coordenadas
      if (!latitud || !longitud) {
        throw new HttpException(
          'Se requieren latitud y longitud para buscar conductores cercanos',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
        throw new HttpException(
          'Coordenadas inválidas',
          HttpStatus.BAD_REQUEST,
        );
      }

      const users = await this.userModel
        .find({
          role: 'driver',
          isAvailable: true,
          'ubicacion.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitud, latitud],
              },
              $maxDistance: maxDistance,
            },
          },
        })
        .select('-password')
        .limit(3)
        .lean()
        .exec();

      return users as IUser[];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al buscar conductores cercanos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}