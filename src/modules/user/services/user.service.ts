import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      // Asegurarse de que el tipo de ubicación sea 'Point'
      const userData = {
        ...createUserDto,
        ubicacion: {
          type: 'Point',
          coordinates: createUserDto.ubicacion.coordinates,
        },
      };

      const createdUser = new this.userModel(userData);
      return await createdUser.save();
    } catch (error) {
      throw error;
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