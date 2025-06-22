import { Test, TestingModule } from '@nestjs/testing';
import { ObtenerConductoresCercanosUseCase } from '../../../src/domain/use-cases/conductor/obtener-conductores-cercanos.use-case';
import { ConductorRepository } from '../../../src/domain/repositories/conductor.repository';
import { Conductor } from '../../../src/domain/entities/conductor.entity';
import { Ubicacion } from '../../../src/domain/value-objects/ubicacion.value-object';

// Create a mock repository that implements the ConductorRepository interface
class MockConductorRepository implements ConductorRepository {
  async obtenerCercanos(ubicacion: Ubicacion, radioKm: number): Promise<Conductor[]> {
    return [];
  }
  
  // Implement all required methods from the interface
  async guardar(conductor: Conductor): Promise<Conductor> { return conductor; }
  async crear(conductor: Conductor): Promise<Conductor> { return conductor; }
  async actualizar(conductor: Conductor): Promise<Conductor> { return conductor; }
  async eliminar(id: string): Promise<boolean> { return true; }
  async obtenerPorId(id: string): Promise<Conductor | null> { return null; }
  async obtenerTodos(): Promise<Conductor[]> { return []; }
  async obtenerDisponibles(): Promise<Conductor[]> { return []; }
  async marcarComoDisponible(id: string, disponible: boolean): Promise<boolean> { return true; }
}

// Update the paths to match your project structure
// The test file is in: test/domain/use-cases/
// The source files are in: src/domain/...

describe('ObtenerConductoresCercanosUseCase', () => {
  let useCase: ObtenerConductoresCercanosUseCase;
  let mockConductorRepo: jest.Mocked<ConductorRepository>;

  // Mock data
  const mockUbicacion = new Ubicacion(40.7128, -74.0060); // New York coordinates
  
  // Create proper Conductor instances with all required methods
  const crearConductor = (
    id: string, 
    nombre: string, 
    email: string, 
    ubicacion: Ubicacion,
    telefono: string = '+1234567890',
    vehiculo?: { modelo: string; placa: string; color: string }
  ) => {
    const conductor = new Conductor(
      id,
      nombre,
      email,
      telefono,
      ubicacion,
      true,
      undefined,
      vehiculo
    );
    return conductor;
  };

  const mockConductores: Conductor[] = [
    crearConductor(
      '1',
      'John Doe',
      'john@example.com',
      new Ubicacion(40.7128, -74.0061), // Very close to mockUbicacion
      '+1234567890',
      {
        modelo: 'Toyota Corolla',
        placa: 'ABC123',
        color: 'Rojo',
      }
    ),
    crearConductor(
      '2',
      'Jane Smith',
      'jane@example.com',
      new Ubicacion(40.7128, -74.0062), // Very close to mockUbicacion
      '+1234567891',
      {
        modelo: 'Honda Civic',
        placa: 'XYZ789',
        color: 'Azul',
      }
    ),
  ];

  beforeEach(async () => {
    // Create a mock implementation of the repository
    mockConductorRepo = {
      obtenerCercanos: jest.fn(),
      guardar: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerDisponibles: jest.fn(),
      marcarComoDisponible: jest.fn(),
    } as unknown as jest.Mocked<ConductorRepository>;

    // Manually create the use case with the mock repository
    useCase = new ObtenerConductoresCercanosUseCase(mockConductorRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });


  describe('execute', () => {
    it('should return an array of nearby drivers', async () => {
      // Arrange
      const radioKm = 3;
      mockConductorRepo.obtenerCercanos.mockResolvedValue(mockConductores);

      // Act
      const result = await useCase.execute(mockUbicacion, radioKm);

      // Assert
      expect(mockConductorRepo.obtenerCercanos).toHaveBeenCalledWith(expect.any(Ubicacion), radioKm);
      expect(mockConductorRepo.obtenerCercanos).toHaveBeenCalledWith(expect.objectContaining({
        latitud: expect.any(Number),
        longitud: expect.any(Number)
      }), radioKm);
      expect(result).toEqual(mockConductores);
      expect(result.length).toBe(2);
    });

    it('should use default radius of 3km when not provided', async () => {
      // Arrange
      mockConductorRepo.obtenerCercanos.mockResolvedValue(mockConductores);

      // Act
      await useCase.execute(mockUbicacion);

      // Assert
      expect(mockConductorRepo.obtenerCercanos).toHaveBeenCalledWith(mockUbicacion, 3);
    });

    it('should return an empty array when no drivers are found', async () => {
      // Arrange
      mockConductorRepo.obtenerCercanos.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(mockUbicacion, 3);

      // Assert
      expect(mockConductorRepo.obtenerCercanos).toHaveBeenCalledWith(mockUbicacion, 3);
      expect(mockConductorRepo.obtenerCercanos).toHaveBeenCalledWith(expect.objectContaining({
        latitud: expect.any(Number),
        longitud: expect.any(Number)
      }), 3);
      expect(mockConductorRepo.obtenerCercanos).toHaveBeenCalledWith(expect.objectContaining({
        latitud: expect.any(Number),
        longitud: expect.any(Number)
      }), 3);
      expect(result).toEqual([]);
    });
  });
});
