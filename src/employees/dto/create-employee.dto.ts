import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { EmploymentType } from '../enums/employment-type.enum';
import { WorkPattern } from '../enums/work-patter.enum';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsEnum(WorkPattern)
  @IsOptional()
  workPattern?: WorkPattern;

  @IsString()
  @IsOptional()
  officeId?: string;
}
