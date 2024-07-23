
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator'
export class CreateInformacion {
    @IsString()
    titulo: string
    
    @IsString()
    texto: string
    
    imagen: any

}
