import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EspaciosService } from './espacios.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Controller('espacios')
export class EspaciosController {
  constructor(private readonly espaciosService: EspaciosService) {}

  @Post()
  create(@Body() createEspacioDto: CreateEspacioDto) {
    return this.espaciosService.create(createEspacioDto);
  }

  @Get()
  findAll() {
    return this.espaciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.espaciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspacioDto: UpdateEspacioDto) {
    return this.espaciosService.update(+id, updateEspacioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.espaciosService.remove(+id);
  }
}
