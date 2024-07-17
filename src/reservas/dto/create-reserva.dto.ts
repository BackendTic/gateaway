
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, isBoolean } from "class-validator"
import { EstadoReserva } from "../enum/reservas.enum";

export class CreateReservaDto {
    @IsString()
    usuarioId: string

    @IsUUID()
    espacioId: string

    @IsDate()
    @Transform(({ value }) => {
      if (typeof value === 'string') {
        const [day, month, year] = value.split('-');
        return new Date(`${year}-${month}-${day}`);
      }
      return value;
    }, { toClassOnly: true })
    fechaInicio: Date;
  
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
      if (typeof value === 'string') {
        const [day, month, year] = value.split('-');
        return new Date(`${year}-${month}-${day}`);
      }
      return value;
    }, { toClassOnly: true })
    fechaFin: Date;
  
    @IsInt()
    horaInicio: number;
    
    @IsOptional()
    @IsEnum(EstadoReserva)
    estado: EstadoReserva = EstadoReserva.Activa

    @IsBoolean()
    implemento_req: Boolean

    @IsBoolean()
    isAdmin: Boolean

    constructor(partial: Partial<CreateReservaDto>) {
      Object.assign(this, partial);
      if (!this.estado) {
        this.estado = EstadoReserva.Activa; // Establecer el valor por defecto si no se proporciona
      }
    }

}