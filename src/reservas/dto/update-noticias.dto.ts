import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateNoticias } from './create-noticias.dto';

export class UpdateNoticiasDto extends PartialType(CreateNoticias) {
}
