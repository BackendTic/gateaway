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
    "FUTBOL":`futbolDefecto.jpeg`,
    "BASKET":`basketDefecto.jpg`,
    "VOLEY":`voleyDefecto.jpeg`,
    "TENIS":`tenisDefecto.jpg`,
    "PING_PONG":`pingPongDefecto.jpg`,
  }
  constructor( 
    @Inject(IMPLEMENTOS_SERVICE) private readonly implementosCliente:ClientProxy
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("imagen"))
  async create(@Body() createImplementoDto: CreateImplementoDto, 
              @UploadedFile() imagen: Express.Multer.File) {
    try {
      console.log( imagen );
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
  async findAll() {
    const implementos = await this.implementosCliente.send('findAllImplemento',{}).toPromise();
    const implementosTransformados = implementos.map(implemento => {
      return {
        ...implemento,
        imagen: `${envs.gatewayHost}/files/implementos/${implemento.imagen}`
      };
    });
    return implementosTransformados
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
