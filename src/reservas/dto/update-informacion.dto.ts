import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateInformacion } from './create-informacion.dto';

export class UpdateInformacionDto extends PartialType(CreateInformacion) {
}
