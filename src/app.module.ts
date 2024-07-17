import { Module } from '@nestjs/common';
import { ImplementosModule } from './implementos/implementos.module';
import { EspaciosModule } from './espacios/espacios.module';
import { FilesModule } from './files/files.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [ImplementosModule, EspaciosModule, FilesModule, ReservasModule],
})
export class AppModule {}
