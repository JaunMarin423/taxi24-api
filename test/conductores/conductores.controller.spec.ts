import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConductorController } from '../../src/modules/conductor/controllers/conductor.controller';
import { ConductorService } from '../../src/modules/conductor/services/conductor.service';
import { CrearConductorDto } from '../../src/modules/conductor/dtos/crear-conductor.dto';
import { Conductor } from '../../src/modules/conductor/schemas/conductor.schema';

// Mock console.error to prevent error logs from cluttering test output
const originalConsoleError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  jest.clearAllMocks();
});

describe('ConductorController', () => {
  let controller: ConductorController;
  let service: ConductorService;

  const mockConductor: Conductor = {
    _id: '1',
    nombre: 'Test Driver',
    email: 'driver@test.com',
    telefono: '+1234567890',
    licencia: 'LIC12345678',
    ubicacion: {
      type: 'Point',
      coordinates: [-74.5, 40]
    },
    disponible: true,
    vehiculo: {
      placa: 'ABC123',
      modelo: 'Toyota Corolla',
      color: 'Blanco'
    },
    calificacionPromedio: 4.5,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockConductor2: Conductor = {
    ...mockConductor,
    _id: '2',
    email: 'driver2@test.com',
    disponible: false
  };

  let mockService: Partial<ConductorService>;

  beforeEach(async () => {
    mockService = {
      crear: jest.fn().mockResolvedValue(mockConductor),
      obtenerTodos: jest.fn().mockResolvedValue([mockConductor, mockConductor2]),
      obtenerPorId: jest.fn().mockImplementation((id: string) => {
        if (id === 'not-found') {
          return Promise.resolve(null);
        }
        return Promise.resolve(mockConductor);
      }),
      obtenerDisponibles: jest.fn().mockResolvedValue([mockConductor]),
      obtenerCercanos: jest.fn().mockResolvedValue([mockConductor])
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConductorController],
      providers: [
        {
          provide: ConductorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ConductorController>(ConductorController);
    service = module.get<ConductorService>(ConductorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /conductores', () => {
    const crearDto: CrearConductorDto = {
      nombre: 'Test Driver',
      email: 'driver@test.com',
      telefono: '+1234567890',
      licencia: 'LIC12345678',
      ubicacion: {
        type: 'Point',
        coordinates: [-74.5, 40]
      },
      vehiculo: {
        placa: 'ABC123',
        modelo: 'Toyota Corolla',
        color: 'Blanco'
      },
      disponible: true
    };

    it('debería crear un nuevo conductor', async () => {
      const result = await controller.crear(crearDto);
      expect(service.crear).toHaveBeenCalledWith(crearDto);
      expect(result).toEqual(mockConductor);
    });

    it('debería lanzar BadRequestException cuando los datos son inválidos', async () => {
      const invalidDto = { ...crearDto, email: 'invalid-email' };
      
      // Mock the validation error
      const error = new BadRequestException('El formato del email no es válido');
      jest.spyOn(service, 'crear').mockRejectedValueOnce(error);
      
      await expect(controller.crear(invalidDto)).rejects.toThrow(BadRequestException);
      
      // Verify the error was logged
      expect(console.error).toHaveBeenCalledWith('Error al crear conductor:', expect.any(BadRequestException));
    });
  });

  describe('GET /conductores', () => {
    it('debería retornar un arreglo de conductores', async () => {
      const result = await controller.obtenerTodos();
      expect(service.obtenerTodos).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(mockConductor);
      expect(result).toContainEqual(mockConductor2);
    });

    it('debería manejar correctamente cuando no hay conductores', async () => {
      jest.spyOn(service, 'obtenerTodos').mockResolvedValueOnce([]);
      const result = await controller.obtenerTodos();
      expect(result).toEqual([]);
    });
  });

  describe('GET /conductores/:id', () => {
    it('debería retornar un solo conductor', async () => {
      const testId = '507f1f77bcf86cd799439011'; // Valid MongoDB-like ID
      const result = await controller.obtenerPorId(testId);
      expect(service.obtenerPorId).toHaveBeenCalledWith(testId);
      expect(result).toEqual(mockConductor);
    });

    it('debería lanzar NotFoundException cuando el conductor no existe', async () => {
      const testId = '507f1f77bcf86cd799439011'; // Valid MongoDB-like ID
      jest.spyOn(service, 'obtenerPorId').mockResolvedValueOnce(null);
      await expect(controller.obtenerPorId(testId)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException cuando el ID no es válido', async () => {
      const invalidId = 'invalid-id';
      await expect(controller.obtenerPorId(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /conductores/disponibles', () => {
    it('debería retornar conductores disponibles', async () => {
      const result = await controller.obtenerDisponibles();
      expect(service.obtenerDisponibles).toHaveBeenCalled();
      expect(result).toEqual([mockConductor]);
      expect(result.every(c => c.disponible)).toBeTruthy();
    });

    it('debería retornar un arreglo vacío cuando no hay conductores disponibles', async () => {
      jest.spyOn(service, 'obtenerDisponibles').mockResolvedValueOnce([]);
      const result = await controller.obtenerDisponibles();
      expect(result).toEqual([]);
    });
  });

  describe('GET /conductores/cercanos', () => {
    const lat = 40;
    const lng = -74.5;
    const distancia = 3000;

    it('debería retornar conductores cercanos', async () => {
      const result = await controller.obtenerCercanos(lat, lng, distancia);
      expect(service.obtenerCercanos).toHaveBeenCalledWith(lat, lng, distancia);
      expect(result).toEqual([mockConductor]);
    });

    it('debería manejar correctamente cuando no hay conductores cercanos', async () => {
      jest.spyOn(service, 'obtenerCercanos').mockResolvedValueOnce([]);
      const result = await controller.obtenerCercanos(lat, lng, distancia);
      expect(result).toEqual([]);
    });

    it('debería usar una distancia por defecto si no se especifica', async () => {
      await controller.obtenerCercanos(lat, lng);
      expect(service.obtenerCercanos).toHaveBeenCalledWith(lat, lng, 5000);
    });
  });
});
