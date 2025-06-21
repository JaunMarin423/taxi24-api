import { Controller, Post, Body } from '@nestjs/common';
import { ViajeService } from '../services/viaje.service';

@Controller('viajes')
export class ViajeController {
  constructor(private readonly viajeService: ViajeService) {}

  @Post()
  async crearViaje(@Body() data: { id: string; stado: boolean; conductor: boolean }) {
    return this.viajeService.crearViaje(data);
  }
}