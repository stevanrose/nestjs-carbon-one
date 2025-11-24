import { Test, TestingModule } from '@nestjs/testing';
import { OfficesService } from './offices.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { create } from 'domain';

describe('OfficesService', () => {
  let service: OfficesService;
  let prisma: PrismaService;

  const mockPrisma = {
    office: {
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
      providers: [OfficesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<OfficesService>(OfficesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should create an office', async () => {
    const dto = { code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' };
    const created = { id: 1, ...dto };
    mockPrisma.office.create.mockResolvedValue(created);

    expect(await service.create(dto)).toEqual(created);
    expect(prisma.office.create).toHaveBeenCalledWith({ data: dto });
  });
  it('should find all offices', async () => {
    const offices = [
      { id: 1, code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' },
      { id: 2, code: 'NYC-01', name: 'New York Office', gridRegionCode: 'US-NY' },
    ];
    mockPrisma.office.findMany.mockResolvedValue(offices);
    mockPrisma.office.count.mockResolvedValue(1);

    const result = await service.findAll({ page: 0, size: 10, sort: 'name, asc' });

    expect(result.content).toEqual(offices);
    expect(result.page).toBe(0);
    expect(result.size).toBe(10);
    expect(result.totalElements).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should find one office by id', async () => {
    const office = { id: '1', code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' };
    mockPrisma.office.findUnique.mockResolvedValue(office);

    expect(await service.findOne('1')).toEqual(office);
    expect(prisma.office.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should throw NotFoundException if office not found', async () => {
    mockPrisma.office.findUnique.mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    expect(prisma.office.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
  });

  it('should update an office', async () => {
    const dto = { name: 'Updated London Office' };
    const updated = {
      id: '1',
      code: 'LON-01',
      name: 'Updated London Office',
      gridRegionCode: 'UK-GB-L',
    };

    mockPrisma.office.findUnique.mockResolvedValue({
      id: '1',
      code: 'LON-01',
      name: 'London Office',
      gridRegionCode: 'UK-GB-L',
    });
    mockPrisma.office.update.mockResolvedValue(updated);

    expect(await service.update('1', dto)).toEqual(updated);
    expect(prisma.office.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
  });

  it('should remove an office', async () => {
    const deleted = { id: '1', code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' };

    mockPrisma.office.findUnique.mockResolvedValue(deleted);
    mockPrisma.office.delete.mockResolvedValue(deleted);

    expect(await service.remove('1')).toEqual(deleted);
    expect(prisma.office.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
