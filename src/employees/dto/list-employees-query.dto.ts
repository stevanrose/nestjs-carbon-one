import { Type } from 'class-transformer';

import { IsEnum, isEmail, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { EmploymentType } from '../enums/employment-type.enum';
import { WorkPattern } from '../enums/work-patter.enum';

export class ListEmployeesQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  sort?: string = 'email, asc';

  @IsString()
  @IsOptional()
  officeId?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsEnum(WorkPattern)
  @IsOptional()
  workPattern?: WorkPattern;
}
