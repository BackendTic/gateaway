import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseUUIDPipe,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RESERVAS_SERVICE } from 'src/config/services';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { envs } from 'src/config/envs';
import * as FormData from 'form-data';
import { UpdateInformacionDto } from './dto/update-informacion.dto';
import { UpdateRepresentanteDto } from './dto/update-representante.dto';

@Controller('reservas')
export class ReservasController {
  constructor(
    @Inject(RESERVAS_SERVICE) private readonly reservasCliente: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createReservaDto: CreateReservaDto) {
    try {
      return await this.reservasCliente.send('createReserva', createReservaDto).toPromise();
    } catch (error) {
      // Manejar y retransmitir excepciones aquí si es necesario
      throw new HttpException(error.message || 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }
  
  @Get('/timeSlots')
  async findBetweenDatesAndSpace(
    @Query('espacioId') espacioId: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reservasCliente.send('viewReservasBetweenSpace', {
      espacioId,
      fechaInicio,
      fechaFin,
    });
  }

  @Get('/timeSlotsBI')
  async findSlotsBySpace(@Query('espacioId') espacioId: string) {
    return this.reservasCliente.send('viewReservasByespacio', { espacioId });
  }

  @Get('/timeSlotsAll')
  async findBetweenDates(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reservasCliente.send('viewReservasBetweenDates', {
      fechaInicio,
      fechaFin,
    });
  }

  @Get('/reservas')
  findAllReservas() {
    return this.reservasCliente.send('findAllReservas', {});
  }

  @Get('/eventos')
  findAllEventos() {
    return this.reservasCliente.send('findAllEventos', {});
  }

  @Get('/reservaUsuario/:userid')
  findReservaByUser(@Param('userid') userid: string) {
    return this.reservasCliente.send('findOneReservaByUserId', userid);
  }

  @Get('/aTimeSlots')
  findAllTimes() {
    return this.reservasCliente.send('findAllTimeSlots', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasCliente.send('findOneReserva', +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    //console.log(updateReservaDto);
    return this.reservasCliente.send('updateReserva', {
      id,
      ...updateReservaDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasCliente.send('removeReserva', id);
  }

  ////// endpoint para manejo de informacion, noticias, representantes ///////

  //informacion
  @Post('/informacion')
  @UseInterceptors(FileInterceptor('imagen'))
  async createInformacion(
    @Body() createInformationDto: any,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (imagen) {
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype,
        });
        const resposnse = await axios.post(
          `${envs.gatewayHost}/files/informacion`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        createInformationDto.imagen = resposnse.data;
      } else {
        throw new BadRequestException('Verifique que envio la imagen');
      }
      return this.reservasCliente.send(
        'createInformation',
        createInformationDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/informacion/consulta')
  async findAllInformacion() {
    try {
      const informacion = await this.reservasCliente
        .send('findAllInformacion', {})
        .toPromise();

      // Verifica si 'informacion' es un array
      if (!Array.isArray(informacion)) {
        throw new Error('La respuesta no es un array');
      }

      const informacionTransformados = informacion.map((info) => {
        if (!info.imagen) {
          throw new Error('Falta el campo imagen en la información recibida');
        }

        return {
          ...info,
          imagen: `${envs.gatewayHost}/files/informacion/${info.imagen}`,
        };
      });

      return informacionTransformados;
    } catch (error) {
      console.error('Error al recuperar la información:', error);
      throw new Error('No se pudo recuperar la información');
    }
  }

  @Get('/informacion/:id')
  async findOneInformacion(@Param('id', ParseUUIDPipe) id: string) {
    const implemento = await this.reservasCliente
      .send('findOneInformacion', id)
      .toPromise();
    if (!implemento) {
      throw new NotFoundException('Informacion no encontradoa');
    }
    return implemento;
  }

  @Patch('/informacion/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  async updateInformation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInformationDto: UpdateInformacionDto,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (imagen) {
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype,
        });
        const response = await axios.post(
          `${envs.gatewayHost}/files/informacion`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        updateInformationDto.imagen = response.data;
      }

      return this.reservasCliente.send('updateInformacion', {
        id,
        ...updateInformationDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/informacion/:id')
  removeInformacion(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservasCliente.send('removeInformation', id);
  }
  
  //noticias
  @Post('/noticias')
  @UseInterceptors(FileInterceptor('imagen'))
  async createNoticia(
    @Body() createNoticiaDto: any,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (imagen) {
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype,
        });
        const resposnse = await axios.post(
          `${envs.gatewayHost}/files/noticias`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        createNoticiaDto.imagen = resposnse.data;
      } else {
        throw new BadRequestException('Verifique que envio la imagen');
      }
      return this.reservasCliente.send(
        'createNoticias',
        createNoticiaDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/noticias/consulta')
  async findAllNoticias() {
    try {
      const noticias = await this.reservasCliente
        .send('findAllNoticias', {})
        .toPromise();

      // Verifica si 'informacion' es un array
      if (!Array.isArray(noticias)) {
        throw new Error('La respuesta no es un array');
      }

      const noticiasTransformados = noticias.map((info) => {
        if (!info.imagen) {
          throw new Error('Falta el campo imagen en la información recibida');
        }

        return {
          ...info,
          imagen: `${envs.gatewayHost}/files/noticias/${info.imagen}`,
        };
      });

      return noticiasTransformados;
    } catch (error) {
      console.error('Error al recuperar la información:', error);
      throw new Error('No se pudo recuperar la información');
    }
  }

  @Get('/noticias/:id')
  async findOneNoticias(@Param('id', ParseUUIDPipe) id: string) {
    const noticia = await this.reservasCliente
      .send('findOneNoticias', id)
      .toPromise();
    if (!noticia) {
      throw new NotFoundException('Noticia no encontradoa');
    }
    return noticia;
  }

  @Patch('/noticia/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  async updateNoticia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoticiaDto: UpdateInformacionDto,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (imagen) {
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype,
        });
        const response = await axios.post(
          `${envs.gatewayHost}/files/noticias`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        updateNoticiaDto.imagen = response.data;
      }

      return this.reservasCliente.send('updateNoticias', {
        id,
        ...updateNoticiaDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/noticias/:id')
  removeNoticias(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservasCliente.send('removeNoticias', id);
  }

  //representantes
  @Post('/representantes')
  @UseInterceptors(FileInterceptor('imagen'))
  async createRepresentantes(
    @Body() createRepresentantesDto: any,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (imagen) {
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype,
        });
        const resposnse = await axios.post(
          `${envs.gatewayHost}/files/representantes`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        createRepresentantesDto.imagen = resposnse.data;
      } else {
        throw new BadRequestException('Verifique que envio la imagen');
      }
      return this.reservasCliente.send(
        'createRepresentantes',
        createRepresentantesDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/representantes/consulta')
  async findAllRepresentantes() {
    try {
      const representantes = await this.reservasCliente
        .send('findAllRepresentantes', {})
        .toPromise();

      // Verifica si 'informacion' es un array
      if (!Array.isArray(representantes)) {
        throw new Error('La respuesta no es un array');
      }

      const noticiasTransformados = representantes.map((info) => {
        if (!info.imagen) {
          throw new Error('Falta el campo imagen en la información recibida');
        }

        return {
          ...info,
          imagen: `${envs.gatewayHost}/files/representantes/${info.imagen}`,
        };
      });

      return noticiasTransformados;
    } catch (error) {
      console.error('Error al recuperar la información:', error);
      throw new Error('No se pudo recuperar la información');
    }
  }

  @Get('/representantes/:id')
  async findRepresentantes(@Param('id', ParseUUIDPipe) id: string) {
    const representante = await this.reservasCliente
      .send('findOneRepresentantes', id)
      .toPromise();
    if (!representante) {
      throw new NotFoundException('Noticia no encontradoa');
    }
    return representante;
  }

  @Patch('/representantes/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  async updateRepresentantes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRepresentantesDto: UpdateRepresentanteDto,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      if (imagen) {
        const formData = new FormData();
        formData.append('imagen', imagen.buffer, {
          filename: imagen.originalname,
          contentType: imagen.mimetype,
        });
        const response = await axios.post(
          `${envs.gatewayHost}/files/representantes`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        updateRepresentantesDto.imagen = response.data;
      }

      return this.reservasCliente.send('updateRepresentantes', {
        id,
        ...updateRepresentantesDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/representantes/:id')
  removeRepresentantes(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservasCliente.send('removeRepresentantes', id);
  }

}
