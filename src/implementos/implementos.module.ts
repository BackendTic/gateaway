import { Module } from '@nestjs/common';
import { ImplementosController } from './implementos.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IMPLEMENTOS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [ImplementosController],
  imports:[
    ClientsModule.register([
      {
        name:IMPLEMENTOS_SERVICE, 
        transport:Transport.TCP,
        options:{
          host: envs.implementosMicroserviceHost,
          port: envs.implementosMicroservicePort,
        }
      }
    ])
  ]
})
export class ImplementosModule {}
