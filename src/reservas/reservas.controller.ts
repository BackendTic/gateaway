import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RESERVAS_SERVICE } from 'src/config/services';

@Controller('reservas')
export class ReservasController {
  constructor(
    @Inject(RESERVAS_SERVICE) private readonly reservasCliente:ClientProxy
  ) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasCliente.send("createReserva", createReservaDto)
  }

  @Get('/timeSlots')
  async findBetweenDatesAndSpace(
    @Query('espacioId') espacioId: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reservasCliente.send("viewReservasBetweenSpace",{espacioId, fechaInicio, fechaFin});
  }

  @Get('/timeSlotsBI')
  async findSlotsBySpace(
    @Query('espacioId') espacioId: string
  ) {
    return this.reservasCliente.send("viewReservasByespacio",{espacioId});
  }

  @Get('/timeSlotsAll')
  async findBetweenDates(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reservasCliente.send("viewReservasBetweenDates",{fechaInicio, fechaFin});
  }

  @Get("/reservas")
  findAllReservas() {
    return this.reservasCliente.send("findAllReservas",{})
  }

  @Get("/eventos")
  findAllEventos() {
    return this.reservasCliente.send("findAllEventos",{})
  }

  @Get('/reservaUsuario/:userid')
  findReservaByUser(@Param('userid') userid: string) {
    return this.reservasCliente.send("findOneReservaByUserId", userid);
  }

  @Get("/aTimeSlots")
  findAllTimes() {
    return this.reservasCliente.send("findAllTimeSlots",{})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasCliente.send("findOneReserva",+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    console.log(updateReservaDto);
    return this.reservasCliente.send("updateReserva",{ id, ...updateReservaDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasCliente.send("removeReserva",id);
  }
}
