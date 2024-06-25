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


  @Get("implementos/:name")
  findProductImage(
    @Res() res: Response,
    @Param("name") name:string
  ){
    const path = this.filesService.findProductImage(name)

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
  UploadImage(@UploadedFile() imagen: Express.Multer.File) {

    const secureURL = `${envs.gatewayHost}/files/implementos/${imagen.originalname}`

    return secureURL
  }

  
}
