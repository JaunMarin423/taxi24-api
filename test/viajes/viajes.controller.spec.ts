import { Test, TestingModule } from '@nestjs/testing';
import { ViajeController } from '../../src/modules/viaje/controllers/viaje.controller';
import { ViajeService } from '../../src/modules/viaje/services/viaje.service';
import { CrearViajeDto } from '../../src/modules/viaje/dtos/crear-viaje.dto';
import { CompletarViajeDto } from '../../src/modules/viaje/dto/completar-viaje.dto';

describe('ViajeController', () => {
  let controller: ViajeController;
  let service: ViajeService;

  const mockViaje: any = {
    id: '1',
    idPasajero: 'passenger1',
    idConductor: 'driver1',
    origen: {
      lat: 40.7128,
      lng: -74.0060
    },
    destino: {
      lat: 40.7138,
      lng: -74.0070
    },
    estado: 'PENDIENTE',
    fechaInicio: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViajeController],
      providers: [
        {
          provide: ViajeService,
          useValue: {
            crearViaje: jest.fn().mockResolvedValue(mockViaje),
            obtenerViajesActivos: jest.fn().mockResolvedValue([mockViaje]),
            obtenerPorId: jest.fn().mockResolvedValue(mockViaje),
            obtenerViajeActivoPorPasajero: jest.fn().mockResolvedValue(mockViaje),
            obtenerViajeActivoPorConductor: jest.fn().mockResolvedValue(mockViaje),
            actualizar: jest.fn().mockImplementation((viaje) => Promise.resolve(viaje)),
            completarViaje: jest.fn().mockResolvedValue({
              viaje: {...mockViaje, estado: 'COMPLETADO'},
              factura: { id: 'invoice1', monto: 25.5 }
            })
          },
        },
      ],
    }).compile();

    controller = module.get<ViajeController>(ViajeController);
    service = module.get<ViajeService>(ViajeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /viajes', () => {
    it('should create a new trip', async () => {
      const createDto: CrearViajeDto = {
        pasajeroId: 'passenger1',
        conductorId: 'driver1',
        origen: {
          latitud: 40.7128,
          longitud: -74.0060
        },
        destino: {
          latitud: 40.7138,
          longitud: -74.0070
        }
      };

      const result = await controller.crearViaje(createDto);
      expect(service.crearViaje).toHaveBeenCalled();
      expect(result).toEqual(mockViaje);
    });
  });

  describe('GET /viajes/activos', () => {
    it('should return active trips', async () => {
      const result = await controller.listarActivos();
      expect(service.obtenerViajesActivos).toHaveBeenCalled();
      expect(result).toEqual([mockViaje]);
    });
  });

  describe('PATCH /viajes/:id/iniciar', () => {
    it('should start a trip', async () => {
      const viajePendiente = { ...mockViaje, estado: 'PENDIENTE' };
      const viajeEnCurso = { ...mockViaje, estado: 'EN_CURSO' };
      
      jest.spyOn(service, 'obtenerPorId').mockResolvedValue(viajePendiente);
      jest.spyOn(service, 'actualizar').mockResolvedValue(viajeEnCurso);
      
      const result = await controller.iniciarViaje('1');
      
      expect(service.obtenerPorId).toHaveBeenCalledWith('1');
      expect(service.actualizar).toHaveBeenCalledWith({
        ...viajePendiente,
        estado: 'EN_CURSO'
      });
      expect(result.estado).toBe('EN_CURSO');
    });
    
    it('should throw error if trip is not found', async () => {
      jest.spyOn(service, 'obtenerPorId').mockResolvedValue(null);
      
      await expect(controller.iniciarViaje('1'))
        .rejects
        .toThrow('Viaje no encontrado');
    });
    
    it('should throw error if trip is not in PENDING state', async () => {
      const viajeEnCurso = { ...mockViaje, estado: 'EN_CURSO' };
      jest.spyOn(service, 'obtenerPorId').mockResolvedValue(viajeEnCurso);
      
      await expect(controller.iniciarViaje('1'))
        .rejects
        .toThrow('Solo se pueden iniciar viajes en estado PENDIENTE');
    });
  });

  describe('PATCH /viajes/:id/completar', () => {
    it('should complete a trip', async () => {
      const completeDto: CompletarViajeDto = {
        costo: 25.5,
        distancia: 5.3
      };

      const result = await controller.completarViaje('1', completeDto);
      expect(service.completarViaje).toHaveBeenCalledWith('1', completeDto);
      expect(result.viaje.estado).toBe('COMPLETADO');
      expect(result.factura).toBeDefined();
    });
  });
});
