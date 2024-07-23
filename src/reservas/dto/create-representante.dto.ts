
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator'
export class CreateRepresentante {

    @IsString()
    nombre: string
    
    @IsString()
    cargo: string
    
    imagen: any

}
