import { PartialType } from '@nestjs/mapped-types';
import { CreateEnergystatementDto } from './create-energystatement.dto';

export class UpdateEnergystatementDto extends PartialType(CreateEnergystatementDto) {}
