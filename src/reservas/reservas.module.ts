import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RESERVAS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [ReservasController],
  imports:[
    ClientsModule.register([
      {
        name:RESERVAS_SERVICE, 
        transport:Transport.TCP,
        options:{
          host: envs.reservasMicroserviceHost,
          port: envs.reservasMicroservicePort,
        }
      }
    ])
  ]
})
export class ReservasModule {}
