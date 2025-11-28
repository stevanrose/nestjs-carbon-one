import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnergystatementsService } from './energystatements.service';
import { CreateEnergystatementDto } from './dto/create-energystatement.dto';
import { UpdateEnergystatementDto } from './dto/update-energystatement.dto';

@Controller('energy-statements')
export class EnergystatementsController {
  constructor(private readonly energystatementsService: EnergystatementsService) {}

  @Post()
  create(@Body() createEnergystatementDto: CreateEnergystatementDto) {
    return this.energystatementsService.create(createEnergystatementDto);
  }

  @Get()
  findAll() {
    return this.energystatementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.energystatementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnergystatementDto: UpdateEnergystatementDto) {
    return this.energystatementsService.update(id, updateEnergystatementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.energystatementsService.remove(id);
  }
}
