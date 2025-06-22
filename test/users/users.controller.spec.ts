import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/modules/user/controllers/user.controller';
import { UserService } from '../../src/modules/user/services/user.service';
import { CreateUserDto } from '../../src/modules/user/dtos/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    _id: '1',
    name: 'Test User',
    email: 'user@test.com',
    telefono: '+1234567890',
    ubicacion: {
      type: 'Point',
      coordinates: [-74.5, 40]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUserResponse = {
    _id: '1',
    nombre: 'Test User',
    email: 'user@test.com',
    telefono: '+1234567890',
    ubicacion: {
      type: 'Point',
      coordinates: [-74.5, 40]
    },
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createDto: CreateUserDto = {
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        telefono: '+1234567890',
        ubicacion: {
          type: 'Point',
          coordinates: [-74.5, 40]
        }
      };

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUserResponse]);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUserResponse);
    });
  });
});
