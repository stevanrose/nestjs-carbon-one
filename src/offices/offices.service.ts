import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { ListOfficesQueryDto } from './dto/list-offices-query.dto';
// import { Office } from '@prisma/client';

@Injectable()
export class OfficesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOfficeDto) {
    return this.prisma.office.create({ data });
  }

  async findAll(query: ListOfficesQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const sort = query.sort ?? 'name, asc';

    const [field, directionRaw] = sort.split(',');
    const direction = directionRaw?.trim().toLowerCase() === 'desc' ? 'desc' : 'asc';

    const allowedFields = ['code', 'name', 'gridRegionCode', 'createdAt'];
    const sortField = allowedFields.includes(field.trim()) ? field.trim() : 'name';

    const skip = page * size;
    const take = size;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.office.findMany({
        skip,
        take,
        orderBy: { [sortField]: direction },
      }),
      this.prisma.office.count(),
    ]);

    return {
      content: items,

      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      sort: {
        field: sortField,
        direction,
      },
    };
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
