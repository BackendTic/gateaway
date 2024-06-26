import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, BadRequestException, ParseUUIDPipe, UseInterceptors, UploadedFile, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ESPACIOS_SERVICE } from 'src/config/services';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { envs } from 'src/config/envs';
import * as FormData from 'form-data';


@Controller('espacios')
export class EspaciosController {

  constructor( 
    @Inject(ESPACIOS_SERVICE) private readonly espaciosCliente:ClientProxy
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("imagen"))
  async create(@Body() createEspacioDto: CreateEspacioDto, 
              @UploadedFile() imagen: Express.Multer.File) {
    try {
      // console.log( imagen );
      if(imagen){
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname, 
          contentType: imagen.mimetype,
        });
        const resposnse = await axios.post(`${envs.gatewayHost}/files/espacios`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        });
        createEspacioDto.imagen = resposnse.data
        console.log(createEspacioDto);
      }
      else{
        throw new BadRequestException("Verifique que envio la imagen"); 
      }

      return this.espaciosCliente.send('createEspacio',createEspacioDto);
    } catch (error) {
      throw new BadRequestException(error.message); 
    }
  }

  @Get()
  async findAll() {
    const espacios = await this.espaciosCliente.send('findAllEspacios', {}).toPromise();

    // Usar map para transformar los espacios y añadir la URL completa de la imagen
    const espaciosTransformados = espacios.map(espacio => {
      return {
        ...espacio,
        imagen: `${envs.gatewayHost}/files/espacios/${espacio.imagen}`
      };
    });

    return espaciosTransformados;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
  
  const implemento = await this.espaciosCliente.send('findOneEspacio', id).toPromise();
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
  @Body() updateImplementoDto: UpdateEspacioDto,
  @UploadedFile() imagen: Express.Multer.File
) {
  try {
    if (imagen) {
      const formData = new FormData();
      formData.append('imagen', imagen.buffer, {
        filename: imagen.originalname,
        contentType: imagen.mimetype,
      });
      const response = await axios.post(`${envs.gatewayHost}/files/espacios`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateImplementoDto.imagen = response.data;
    } 

    return this.espaciosCliente.send('updateEspacio', { id, ...updateImplementoDto });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.espaciosCliente.send('removeEspacio', id)
  }


}
 