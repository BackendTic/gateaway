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

  findInformationImage(name:string){
    const path = join(__dirname, '../../static/informacion', name)
    if(!existsSync(path))
      throw new BadRequestException("Imagen no encontrada")
    return path
  }

  findNewsImage(name:string){
    const path = join(__dirname, '../../static/noticias', name)
    if(!existsSync(path))
      throw new BadRequestException("Imagen no encontrada")
    return path
  }

  findRepresentanteImage(name:string){
    const path = join(__dirname, '../../static/representantes', name)
    if(!existsSync(path))
      throw new BadRequestException("Imagen no encontrada")
    return path
  }

}
