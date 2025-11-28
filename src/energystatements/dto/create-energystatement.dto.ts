import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { HeatingFuelType } from './enums/heating-fuel-type.enum';

export class CreateEnergystatementDto {
  @IsString()
  @IsNotEmpty()
  officeId: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  electricityKwh: number;

  @IsEnum(HeatingFuelType)
  @IsOptional()
  heatingFuelType?: HeatingFuelType;

  @IsNumber()
  @IsOptional()
  heatingEnergyKwh?: number;

  @IsOptional()
  @IsNumber()
  renewablePpasKwh?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
