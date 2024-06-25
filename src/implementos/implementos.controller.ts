import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, BadRequestException, ParseUUIDPipe, UseInterceptors, UploadedFile, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateImplementoDto } from './dto/create-implemento.dto';
import { UpdateImplementoDto } from './dto/update-implemento.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IMPLEMENTOS_SERVICE } from 'src/config/services';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { envs } from 'src/config/envs';
import * as FormData from 'form-data';

@Controller('implementos')
export class ImplementosController {

  private imagenesDefault = {
    "FUTBOL":`${envs.gatewayHost}/files/implementos/futbolDefecto.jpeg`,
    "BASKET":`${envs.gatewayHost}/files/implementos/basketDefecto.jpg`,
    "VOLEY":`${envs.gatewayHost}/files/implementos/voleyDefecto.jpeg`,
    "TENIS":`${envs.gatewayHost}/files/implementos/tenisDefecto.jpg`,
    "PING_PONG":`${envs.gatewayHost}/files/implementos/pingPongDefecto.jpg`,
  }
  constructor( 
    @Inject(IMPLEMENTOS_SERVICE) private readonly implementosCliente:ClientProxy
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("imagen"))
  async create(@Body() createImplementoDto: CreateImplementoDto, 
              @UploadedFile() imagen: Express.Multer.File) {
    try {
      // console.log( imagen );
      if(imagen){
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname, 
          contentType: imagen.mimetype,
        });
        const resposnse = await axios.post(`${envs.gatewayHost}/files/implementos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        });
        createImplementoDto.imagen = resposnse.data
      }else{
        createImplementoDto.imagen = this.imagenesDefault[createImplementoDto.disciplina]
      }

      console.log( createImplementoDto );
      
      return this.implementosCliente.send('createImplemento',createImplementoDto);
    } catch (error) {
      throw new BadRequestException(error.message); 
    }
  }

  @Get()
  findAll() {
    return this.implementosCliente.send('findAllImplemento',{});
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
  
  const implemento = await this.implementosCliente.send('findOneImplemento', id).toPromise();
  console.log(implemento);
  if (!implemento){
    throw new NotFoundException("Producto no encontrado"); 
  }
  return implemento
  
}

@Patch(':id')
@UseInterceptors(FileInterceptor("imagen"))
async update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() updateImplementoDto: UpdateImplementoDto,
  @UploadedFile() imagen: Express.Multer.File
) {
  try {
    if (imagen) {
      const formData = new FormData();
      formData.append('imagen', imagen.buffer, {
        filename: imagen.originalname,
        contentType: imagen.mimetype,
      });
      const response = await axios.post(`${envs.gatewayHost}/files/implementos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateImplementoDto.imagen = response.data;
    } 

    return this.implementosCliente.send('updateImplemento', { id, ...updateImplementoDto });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.implementosCliente.send('removeImplemento', id)
  }

}
