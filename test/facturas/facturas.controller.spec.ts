import { Test, TestingModule } from '@nestjs/testing';
import { FacturaController } from '../../src/modules/factura/controllers/factura.controller';
import { FacturaService } from '../../src/modules/factura/services/factura.service';

describe('FacturaController', () => {
  let controller: FacturaController;
  let service: FacturaService;

  const mockFactura = {
    _id: '1',
    viajeId: 'trip1',
    pasajeroId: 'passenger1',
    conductorId: 'driver1',
    monto: 25.5,
    fechaEmision: new Date(),
    fechaViaje: new Date(),
    origen: {
      type: 'Point',
      coordinates: [-74.5, 40]
    },
    destino: {
      type: 'Point',
      coordinates: [-74.6, 40.1]
    },
    distancia: 5.3,
    duracion: 15,
    estado: 'PAGADA'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaController],
      providers: [
        {
          provide: FacturaService,
          useValue: {
            listarTodas: jest.fn().mockResolvedValue([mockFactura]),
            obtenerPorViajeId: jest.fn().mockResolvedValue(mockFactura)
          },
        },
      ],
    }).compile();

    controller = module.get<FacturaController>(FacturaController);
    service = module.get<FacturaService>(FacturaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /facturas', () => {
    it('should return all invoices', async () => {
      const result = await controller.listarTodas(); 
      expect(service.listarTodas).toHaveBeenCalled();
      expect(result).toEqual([mockFactura]);
    });
  });

  describe('GET /facturas/viaje/:id', () => {
    it('should return invoice by trip id', async () => {
      const result = await controller.obtenerPorViajeId('trip1');
      expect(service.obtenerPorViajeId).toHaveBeenCalledWith('trip1');
      expect(result).toEqual(mockFactura);
    });
  });
});
