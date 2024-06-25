import { Injectable } from '@nestjs/common';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Injectable()
export class EspaciosService {
  create(createEspacioDto: CreateEspacioDto) {
    return 'This action adds a new espacio';
  }

  findAll() {
    return `This action returns all espacios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} espacio`;
  }

  update(id: number, updateEspacioDto: UpdateEspacioDto) {
    return `This action updates a #${id} espacio`;
  }

  remove(id: number) {
    return `This action removes a #${id} espacio`;
  }
}
