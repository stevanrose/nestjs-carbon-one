import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { EmploymentType } from './enums/employment-type.enum';
import { WorkPattern } from './enums/work-patter.enum';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let prisma: PrismaService;

  const mockPrisma = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((operations: any[]) => Promise.all(operations)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should create an employee', async () => {
    const dto = {
      email: 'alice@example.com',
      department: 'Engineering',
      employmentType: EmploymentType.FULL_TIME,
      workPattern: WorkPattern.HYBRID,
    };
    const created = { id: 'emp-1', ...dto };
    mockPrisma.employee.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
    expect(prisma.employee.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should return paged employees', async () => {
    const employees = [
      {
        id: 'emp-1',
        email: 'alice@example.com',
        department: 'Engineering',
        employmentType: EmploymentType.FULL_TIME,
        workPattern: WorkPattern.HYBRID,
      },
    ];

    mockPrisma.employee.findMany.mockResolvedValue(employees);
    mockPrisma.employee.count.mockResolvedValue(1);

    const result = await service.findAll({
      page: 0,
      size: 10,
      sort: 'email,asc',
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(result.content).toEqual(employees);
    expect(result.page).toBe(0);
    expect(result.size).toBe(10);
    expect(result.totalElements).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should apply filters in findAll', async () => {
    mockPrisma.employee.findMany.mockResolvedValue([]);
    mockPrisma.employee.count.mockResolvedValue(0);

    await service.findAll({
      page: 0,
      size: 10,
      sort: 'email,asc',
      officeId: 'office-1',
      department: 'Engineering',
      employmentType: EmploymentType.FULL_TIME,
      workPattern: WorkPattern.REMOTE,
    });

    expect(prisma.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          officeId: 'office-1',
          department: 'Engineering',
          employmentType: EmploymentType.FULL_TIME,
          workPattern: WorkPattern.REMOTE,
        },
      }),
    );
    expect(prisma.employee.count).toHaveBeenCalledWith({
      where: {
        officeId: 'office-1',
        department: 'Engineering',
        employmentType: EmploymentType.FULL_TIME,
        workPattern: WorkPattern.REMOTE,
      },
    });
  });

  it('should return one employee', async () => {
    const employee = {
      id: 'emp-1',
      email: 'alice@example.com',
      department: 'Engineering',
    };
    mockPrisma.employee.findUnique.mockResolvedValue(employee);

    expect(await service.findOne('emp-1')).toEqual(employee);
  });

  it('should throw NotFoundException if employee missing', async () => {
    mockPrisma.employee.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('should update an employee', async () => {
    const existing = {
      id: 'emp-1',
      email: 'alice@example.com',
      department: 'Engineering',
    };
    const dto = { department: 'Platform' };
    const updated = { ...existing, ...dto };

    mockPrisma.employee.findUnique.mockResolvedValue(existing);
    mockPrisma.employee.update.mockResolvedValue(updated);

    const result = await service.update('emp-1', dto);

    expect(result).toEqual(updated);
    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: 'emp-1' },
      data: dto,
    });
  });

  it('should delete an employee', async () => {
    const existing = { id: 'emp-1' };
    mockPrisma.employee.findUnique.mockResolvedValue(existing);
    mockPrisma.employee.delete.mockResolvedValue(existing);

    const result = await service.remove('emp-1');

    expect(result).toEqual(existing);
    expect(mockPrisma.employee.delete).toHaveBeenCalledWith({
      where: { id: 'emp-1' },
    });
  });
});
