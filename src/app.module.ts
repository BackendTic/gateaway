import { Module } from '@nestjs/common';
import { ImplementosModule } from './implementos/implementos.module';
import { EspaciosModule } from './espacios/espacios.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [ImplementosModule, EspaciosModule, FilesModule],
})
export class AppModule {}
