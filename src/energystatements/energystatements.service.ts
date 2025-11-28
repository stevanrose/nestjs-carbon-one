import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnergystatementDto } from './dto/create-energystatement.dto';
import { UpdateEnergystatementDto } from './dto/update-energystatement.dto';

@Injectable()
export class EnergystatementsService {
  constructor(private prisma: PrismaService) {}

  create(createEnergystatementDto: CreateEnergystatementDto) {
    return this.prisma.officeEnergyStatement.create({ data: createEnergystatementDto });
  }

  findAll() {
    // Later: pagination & filters
    return this.prisma.officeEnergyStatement.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.officeEnergyStatement.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`Energy statement ${id} not found`);
    }
    return result;
  }

  async update(id: string, data: UpdateEnergystatementDto) {
    await this.findOne(id);
    return this.prisma.officeEnergyStatement.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.officeEnergyStatement.delete({
      where: { id },
    });
  }
}
