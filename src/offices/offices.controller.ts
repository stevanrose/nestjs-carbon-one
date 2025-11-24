import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { ListOfficesQueryDto } from './dto/list-offices-query.dto';

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  create(@Body() dto: CreateOfficeDto) {
    return this.officesService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListOfficesQueryDto) {
    return this.officesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officesService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.officesService.remove(id);
  }
}
