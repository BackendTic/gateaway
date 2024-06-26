import { Module } from '@nestjs/common';
import { EspaciosController } from './espacios.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ESPACIOS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [EspaciosController],
  imports:[
    ClientsModule.register([
      {
        name:ESPACIOS_SERVICE, 
        transport:Transport.TCP,
        options:{
          host: envs.espaciosMicroserviceHost,
          port: envs.espaciosMicroservicePort,
        }
      }
    ])
  ]
})
export class EspaciosModule {}
