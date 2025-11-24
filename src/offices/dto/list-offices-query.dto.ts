import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class ListOfficesQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page?: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  size?: number = 10;

  @IsString()
  @IsOptional()
  sort?: string;
}
