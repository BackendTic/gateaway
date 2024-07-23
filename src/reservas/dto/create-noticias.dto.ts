
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from 'class-validator'
export class CreateNoticias {
    @IsString()
    titulo: string
    
    @IsString()
    texto: string
    
    imagen: any

}
