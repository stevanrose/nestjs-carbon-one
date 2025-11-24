import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
// import { Office } from '@prisma/client';

@Injectable()
export class OfficesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOfficeDto) {
    return this.prisma.office.create({ data });
  }

  findAll() {
    return this.prisma.office.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const office = await this.prisma.office.findUnique({ where: { id } });

    if (!office) {
      throw new NotFoundException(`Office with ID ${id} not found`);
    }

    return office;
  }

  async update(id: string, data: UpdateOfficeDto) {
    await this.findOne(id);
    return this.prisma.office.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.office.delete({ where: { id } });
  }
}
