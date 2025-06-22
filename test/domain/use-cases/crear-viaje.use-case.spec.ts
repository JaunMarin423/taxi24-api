import { Test, TestingModule } from '@nestjs/testing';
import { CrearViajeUseCase, CrearViajeParams } from '../../../src/domain/use-cases/crear-viaje.use-case';
import { ViajeRepository } from '../../../src/domain/repositories/viaje.repository';
import { Viaje } from '../../../src/domain/entities/viaje.entity';
import { Injectable } from '@nestjs/common';

// Mock implementation of ViajeRepository
class MockViajeRepository {
  crearViaje = jest.fn();
  obtenerPorId = jest.fn();
  actualizar = jest.fn();
  listarActivos = jest.fn();
  obtenerActivoPorPasajero = jest.fn();
  obtenerActivoPorConductor = jest.fn();
}

describe('CrearViajeUseCase', () => {
  let useCase: CrearViajeUseCase;
  let viajeRepo: MockViajeRepository;
  let module: TestingModule;

  const mockViaje = {
    id: '1',
    idConductor: 'driver-123',
    idPasajero: 'passenger-456',
    origen: { lat: 40.7128, lng: -74.0060 },
    destino: { lat: 40.7138, lng: -74.0070 },
    estado: 'PENDIENTE' as const,
    fechaInicio: new Date(),
  } as Viaje;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    viajeRepo = new MockViajeRepository();
    
    // Setup default mock implementations
    viajeRepo.crearViaje.mockImplementation((viaje) => Promise.resolve(viaje));
    viajeRepo.obtenerPorId.mockResolvedValue(null);
    viajeRepo.actualizar.mockImplementation((viaje) => Promise.resolve(viaje));
    viajeRepo.listarActivos.mockResolvedValue([]);
    viajeRepo.obtenerActivoPorPasajero.mockResolvedValue(null);
    viajeRepo.obtenerActivoPorConductor.mockResolvedValue(null);

    module = await Test.createTestingModule({
      providers: [
        {
          provide: CrearViajeUseCase,
          useFactory: () => {
            return new CrearViajeUseCase(viajeRepo);
          },
        },
        {
          provide: 'ViajeRepository',
          useValue: viajeRepo,
        },
      ],
    }).compile();

    useCase = module.get<CrearViajeUseCase>(CrearViajeUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new trip with required parameters', async () => {
      // Arrange
      const createParams: CrearViajeParams = {
        id: '1',
        idConductor: 'driver-123',
        idPasajero: 'passenger-456',
        origen: { lat: 40.7128, lng: -74.0060 },
        destino: { lat: 40.7138, lng: -74.0070 },
        estado: 'PENDIENTE',
      };

      viajeRepo.crearViaje.mockResolvedValue(mockViaje);

      // Act
      const result = await useCase.execute(createParams);

      // Assert
      expect(viajeRepo.crearViaje).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          idConductor: 'driver-123',
          idPasajero: 'passenger-456',
          estado: 'PENDIENTE',
          origen: { lat: 40.7128, lng: -74.0060 },
          destino: { lat: 40.7138, lng: -74.0070 },
        })
      );
      expect(result).toEqual(mockViaje);
    });

    it('should create a trip with optional parameters', async () => {
      // Arrange
      const createParams: CrearViajeParams = {
        id: '2',
        idConductor: 'driver-123',
        idPasajero: 'passenger-456',
        origen: { lat: 40.7128, lng: -74.0060 },
        destino: { lat: 40.7138, lng: -74.0070 },
        estado: 'EN_CURSO',
        fechaInicio: new Date('2023-01-01T12:00:00Z'),
      };

      const expectedViaje = {
        ...mockViaje,
        estado: 'EN_CURSO',
        fechaInicio: new Date('2023-01-01T12:00:00Z'),
      };

      viajeRepo.crearViaje.mockResolvedValue(expectedViaje as Viaje);

      // Act
      const result = await useCase.execute(createParams);

      // Assert
      expect(viajeRepo.crearViaje).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '2',
          estado: 'EN_CURSO',
          fechaInicio: new Date('2023-01-01T12:00:00Z'),
        })
      );
      expect(result).toEqual(expectedViaje);
    });

    it('should handle repository errors', async () => {
      // Arrange
      const createParams: CrearViajeParams = {
        id: '3',
        idConductor: 'driver-123',
        idPasajero: 'passenger-456',
        origen: { lat: 40.7128, lng: -74.0060 },
        destino: { lat: 40.7138, lng: -74.0070 },
        estado: 'PENDIENTE',
      };

      const error = new Error('Database error');
      viajeRepo.crearViaje.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(createParams)).rejects.toThrow('Database error');
    });
  });
});
