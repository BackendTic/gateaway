import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

@Injectable()
export class FilesService {
  findImplementImage(name:string){
    const path = join(__dirname, '../../static/implementos', name)
    if(!existsSync(path))
      throw new BadRequestException("Imagen no encontrada")

    return path
  }


  findSpaceImage(name:string){
    const path = join(__dirname, '../../static/espacios', name)
    if(!existsSync(path))
      throw new BadRequestException("Imagen no encontrada")

    return path
  }
}
