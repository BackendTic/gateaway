import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { envs } from 'src/config/envs';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  //endpoint to implementos
  @Get("implementos/:name")
  findImplementImage(
    @Res() res: Response,
    @Param("name") name:string
  ){
    const path = this.filesService.findImplementImage(name)

    res.sendFile(path)
  }

  @Post("implementos")
  @UseInterceptors(FileInterceptor("imagen",{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/implementos',
      filename: fileNamer
    })
  }))
  UploadImplementImage(@UploadedFile() imagen: Express.Multer.File) {

    const secureURL = `${envs.gatewayHost}/files/implementos/${imagen.originalname}`

    return imagen.originalname
  }

  //endpoint to espacios
  
  @Get("espacios/:name")
  findProductImage(
    @Res() res: Response,
    @Param("name") name:string
  ){
    const path = this.filesService.findSpaceImage(name)

    res.sendFile(path)
  }

  @Post("espacios")
  @UseInterceptors(FileInterceptor("imagen",{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/espacios',
      filename: fileNamer
    })
  }))
  UploadImage(@UploadedFile() imagen: Express.Multer.File) {

    const secureURL = `${envs.gatewayHost}/files/espacios/${imagen.originalname}`

    return imagen.originalname
  }
  
}
