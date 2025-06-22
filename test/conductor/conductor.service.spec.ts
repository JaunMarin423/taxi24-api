import { Test, TestingModule } from '@nestjs/testing';
import { ConductorService } from '../../src/modules/conductor/services/conductor.service';
import { ConductorRepository } from '../../src/domain/repositories/conductor.repository';
import { Conductor as ConductorSchema } from '../../src/modules/conductor/schemas/conductor.schema';
import { Conductor as ConductorEntity } from '../../src/domain/entities/conductor.entity';
import { Ubicacion } from '../../src/domain/value-objects/ubicacion.value-object';
import { CrearConductorDto } from '../../src/modules/conductor/dtos/crear-conductor.dto';
import { ConductorMapper } from '../../src/modules/conductor/mappers/conductor.mapper';

// Mock the ConductorMapper
jest.mock('../../src/modules/conductor/mappers/conductor.mapper');

describe('ConductorService', () => {
  let service: ConductorService;
  let conductorRepository: jest.Mocked<ConductorRepository>;

  const mockUbicacion = new Ubicacion(40.7128, -74.0060);
  
  // Domain entity for business logic
  const mockConductor: ConductorEntity = new ConductorEntity(
    '1',
    'Test Driver',
    'test@example.com',
    '+1234567890',
    mockUbicacion,
    true,
    'LIC123',
    { placa: 'ABC123', modelo: 'Toyota Corolla', color: 'Blanco' }
  );

  // MongoDB schema for repository mocks
  const mockConductorSchema: any = {
    _id: '1',
    nombre: 'Test Driver',
    email: 'test@example.com',
    telefono: '+1234567890',
    ubicacion: {
      type: 'Point',
      coordinates: [mockUbicacion.longitud, mockUbicacion.latitud]
    },
    disponible: true,
    licencia: 'LIC123',
    vehiculo: {
      placa: 'ABC123',
      modelo: 'Toyota Corolla',
      color: 'Blanco'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // This is just an alias for the existing mockConductor to maintain compatibility
  const mockConductorEntity = mockConductor;

  beforeEach(async () => {
    // Mock the repository with all required methods
    const mockRepository: jest.Mocked<ConductorRepository> = {
      obtenerTodos: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerDisponibles: jest.fn(),
      obtenerCercanos: jest.fn(),
      guardar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConductorService,
        {
          provide: 'ConductorRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ConductorService>(ConductorService);
    conductorRepository = module.get('ConductorRepository');
    
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup ConductorMapper mock
    (ConductorMapper.toEntity as jest.Mock).mockImplementation((schema) => {
      if (!schema) return null;
      return mockConductorEntity;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerTodos', () => {
    it('should return an array of conductors', async () => {
      conductorRepository.obtenerTodos.mockResolvedValue([mockConductor]);
      
      const result = await service.obtenerTodos();
      
      expect(conductorRepository.obtenerTodos).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ConductorEntity);
    });
  });

  describe('obtenerPorId', () => {
    it('should return a conductor when found', async () => {
      conductorRepository.obtenerPorId.mockResolvedValue(mockConductor);
      
      const result = await service.obtenerPorId('1');
      
      expect(conductorRepository.obtenerPorId).toHaveBeenCalledWith('1');
      expect(result).toBeInstanceOf(ConductorEntity);
    });

    it('should throw NotFoundException when conductor not found', async () => {
      conductorRepository.obtenerPorId.mockResolvedValue(null);
      
      await expect(service.obtenerPorId('not-found')).rejects.toThrow('Conductor con ID "not-found" no encontrado');
    });
  });

  describe('obtenerDisponibles', () => {
    it('should return available conductors', async () => {
      conductorRepository.obtenerDisponibles.mockResolvedValue([mockConductor]);
      
      const result = await service.obtenerDisponibles();
      
      expect(conductorRepository.obtenerDisponibles).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ConductorEntity);
    });
  });

  describe('obtenerCercanos', () => {
    it('should return nearby conductors', async () => {
      const lat = 40;
      const lng = -74.5;
      const distancia = 5000;
      
      conductorRepository.obtenerCercanos.mockResolvedValue([mockConductor]);
      
      const result = await service.obtenerCercanos(lat, lng, distancia);
      
      expect(conductorRepository.obtenerCercanos).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ConductorEntity);
    });

    it('should use default distance when not provided', async () => {
      const lat = 40;
      const lng = -74.5;
      
      conductorRepository.obtenerCercanos.mockResolvedValue([mockConductor]);
      
      await service.obtenerCercanos(lat, lng);
      
      expect(conductorRepository.obtenerCercanos).toHaveBeenCalledWith(
        expect.any(Ubicacion),
        5000 // Default distance
      );
    });
  });

  describe('crear', () => {
    const crearDto: CrearConductorDto = {
      nombre: 'New Driver',
      email: 'new@example.com',
      telefono: '+1234567890',
      licencia: 'LIC12345678',
      ubicacion: {
        type: 'Point',
        coordinates: [mockUbicacion.longitud, mockUbicacion.latitud]
      },
      vehiculo: {
        placa: 'XYZ789',
        modelo: 'Honda Civic',
        color: 'Rojo'
      },
      disponible: true
    };

    it('should create a new conductor', async () => {
      // Create a mock conductor that will be returned by the mapper
      const mockCreatedConductor = new ConductorEntity(
        '1',
        crearDto.nombre,
        crearDto.email,
        crearDto.telefono,
        new Ubicacion(crearDto.ubicacion.coordinates[1], crearDto.ubicacion.coordinates[0]),
        crearDto.disponible,
        crearDto.licencia,
        crearDto.vehiculo
      );

      // Mock the mapper to return our mock conductor
      (ConductorMapper.toEntity as jest.Mock).mockReturnValue(mockCreatedConductor);
      
      // Mock the repository to return the saved schema
      conductorRepository.guardar.mockImplementation(async (conductor) => {
        // Create a new ConductorEntity with the same properties
        const savedConductor = new ConductorEntity(
          '1',
          conductor.nombre,
          conductor.email,
          conductor.telefono,
          conductor.ubicacion,
          conductor.disponible,
          conductor.licencia,
          conductor.vehiculo
        );
        
        // Add the timestamps that would come from the database
        (savedConductor as any).createdAt = new Date();
        (savedConductor as any).updatedAt = new Date();
        
        return savedConductor;
      });
      
      // Call the service method
      const result = await service.crear(crearDto);
      
      // Verify the repository was called
      expect(conductorRepository.guardar).toHaveBeenCalled();
      
      // Get the argument that was passed to guardar
      const savedConductor = conductorRepository.guardar.mock.calls[0][0] as ConductorEntity;
      
      // Verify the saved conductor has the correct data
      expect(savedConductor.nombre).toBe(crearDto.nombre);
      expect(savedConductor.email).toBe(crearDto.email);
      expect(savedConductor.telefono).toBe(crearDto.telefono);
      expect(savedConductor.licencia).toBe(crearDto.licencia);
      
      // Verify the result matches our expected conductor
      expect(result).toBeDefined();
      
      // Create an expected result object without timestamps for comparison
      const expectedResult = {
        id: '1',
        nombre: crearDto.nombre,
        email: crearDto.email,
        telefono: crearDto.telefono,
        ubicacion: expect.any(Ubicacion),
        disponible: true,
        licencia: crearDto.licencia,
        vehiculo: crearDto.vehiculo
      };
      
      // Verify the result has all expected properties
      expect(result).toMatchObject(expectedResult);
      
      // Verify the ubicacion is properly set
      expect(result.ubicacion).toBeDefined();
      expect(result.ubicacion.latitud).toBe(crearDto.ubicacion.coordinates[1]);
      expect(result.ubicacion.longitud).toBe(crearDto.ubicacion.coordinates[0]);
      expect(result.vehiculo).toBeDefined();
    });

    it('should throw error when coordinates are invalid', async () => {
      const invalidDto = {
        ...crearDto,
        ubicacion: {
          type: 'Point',
          coordinates: ['invalid', 'coordinates']
        }
      };
      
      // Mock console.error to suppress the expected error log
      const originalError = console.error;
      console.error = jest.fn();
      
      await expect(service.crear(invalidDto as any)).rejects.toThrow('Las coordenadas deben ser números válidos');
      
      // Restore console.error
      console.error = originalError;
    });
  });
});
