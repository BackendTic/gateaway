import { TipoImplemento, TipoImplementoList } from '../enum/implementos.enum'
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator'
export class CreateImplementoDto {
    @IsString()
    nombre: string

    @IsOptional()
    // @IsBoolean()
    disponible?: boolean = true
    
    @IsOptional()
    // @IsBoolean()
    estado?: boolean = true

    @IsEnum(TipoImplementoList, {
        message: `El implemento debe pertenecer a: ${TipoImplementoList}`
    })
    disciplina: TipoImplemento

    @IsOptional()
    imagen: any

}
