import { IsNotEmpty, IsOptional, isString, IsNumber, IsString } from 'class-validator';

export class CreateOfficeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  gridRegionCode: string;

  @IsNumber()
  @IsOptional()
  floorAreaM2?: number;
}
