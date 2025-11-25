import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({ data: createEmployeeDto });
  }

  async findAll(@Query() query: ListEmployeesQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const sort = query.sort ?? 'email,asc';

    const [field, directionRaw] = sort.split(',');
    const direction = directionRaw === 'desc' ? 'desc' : 'asc';

    const allowedFields = ['email', 'department', 'createdAt'];
    const sortField = allowedFields.includes(field) ? field : 'email';

    const skip = page * size;
    const take = size;

    const where: Record<string, unknown> = {};

    if (query.officeId) {
      where.officeId = query.officeId;
    }
    if (query.department) {
      where.department = query.department;
    }
    if (query.employmentType) {
      where.employmentType = query.employmentType;
    }
    if (query.workPattern) {
      where.workPattern = query.workPattern;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        skip,
        take,
        orderBy: { [sortField]: direction },
      }),
      this.prisma.employee.count({ where }),
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
      filters: {
        officeId: query.officeId ?? null,
        department: query.department ?? null,
        employmentType: query.employmentType ?? null,
        workPattern: query.workPattern ?? null,
      },
    };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(id: string, data: UpdateEmployeeDto) {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
