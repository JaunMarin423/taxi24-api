import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacturaRepository } from '@domain/repositories/factura.repository';
import { Factura } from '../../modules/factura/entities/factura.entity';
import { Factura as FacturaDocument, FacturaDocument as FacturaMongo } from '../schemas/factura.schema';

@Injectable()
export class FacturaMongoRepository implements FacturaRepository {
  constructor(
    @InjectModel(FacturaDocument.name) private facturaModel: Model<FacturaMongo>,
  ) {}

  async crear(factura: Factura): Promise<Factura> {
    // Extraer las propiedades necesarias de la entidad Factura
    const facturaData = {
      id: factura.id,
      viajeId: factura.viajeId,
      pasajeroId: factura.pasajeroId,
      conductorId: factura.conductorId,
      monto: factura.monto,
      fechaEmision: factura.fechaEmision,
      fechaViaje: factura.fechaViaje,
      origen: factura.origen,
      destino: factura.destino,
      detalles: factura.detalles,
      impuesto: factura.impuesto,
      subtotal: factura.subtotal,
      total: factura.total,
    };

    const createdFactura = new this.facturaModel(facturaData);
    const saved = await createdFactura.save();
    return this.toDomain(saved.toObject());
  }

  async obtenerPorId(id: string): Promise<Factura | null> {
    // Buscar por _id (ObjectId) o por id personalizado
    const factura = await this.facturaModel.findOne({
      $or: [
        { _id: id },
        { id: id }
      ]
    }).exec();
    return factura ? this.toDomain(factura.toObject()) : null;
  }

  async listarPorPasajero(pasajeroId: string): Promise<Factura[]> {
    const facturas = await this.facturaModel.find({ pasajeroId }).exec();
    return facturas.map(f => this.toDomain(f.toObject()));
  }

  async listarPorConductor(conductorId: string): Promise<Factura[]> {
    const facturas = await this.facturaModel.find({ conductorId }).exec();
    return facturas.map(f => this.toDomain(f.toObject()));
  }

  async listarTodas(): Promise<Factura[]> {
    const facturas = await this.facturaModel.find().exec();
    return facturas.map(f => this.toDomain(f.toObject()));
  }

  async obtenerPorViajeId(viajeId: string): Promise<Factura | null> {
    const factura = await this.facturaModel.findOne({ viajeId }).exec();
    return factura ? this.toDomain(factura.toObject()) : null;
  }

  private toDomain(facturaMongo: FacturaMongo): Factura {
    // Crear un objeto que cumpla con la interfaz de Viaje que espera el constructor de Factura
    const viaje = {
      id: facturaMongo.viajeId,
      idPasajero: facturaMongo.pasajeroId,
      idConductor: facturaMongo.conductorId,
      origen: facturaMongo.origen,
      destino: facturaMongo.destino,
      estado: 'COMPLETADO',
      fechaInicio: facturaMongo.fechaViaje,
      fechaFin: facturaMongo.fechaViaje, // Usamos la misma fecha como aproximación
      monto: facturaMongo.monto,
    } as any; // Usamos 'as any' temporalmente para evitar errores de tipo

    const factura = new Factura(viaje);
    
    // Sobrescribir las propiedades que podrían ser diferentes
    (factura as any).id = facturaMongo.id;
    (factura as any).fechaEmision = facturaMongo.fechaEmision;
    
    return factura;
  }
}
