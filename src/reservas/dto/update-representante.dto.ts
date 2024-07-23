import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateRepresentante } from './create-representante.dto';

export class UpdateRepresentanteDto extends PartialType(CreateRepresentante) {
}
