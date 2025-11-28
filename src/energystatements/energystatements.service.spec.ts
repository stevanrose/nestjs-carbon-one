import { Test, TestingModule } from '@nestjs/testing';
import { EnergystatementsService } from './energystatements.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { HeatingFuelType } from './dto/enums/heating-fuel-type.enum';
import { off } from 'process';

describe('EnergystatementsService', () => {
  let service: EnergystatementsService;
  let prisma: PrismaService;

  const mockPrisma = {
    officeEnergyStatement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((operations: any[]) => Promise.all(operations)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnergystatementsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<EnergystatementsService>(EnergystatementsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('Should create an energy statement', async () => {
    const dto = {
      officeId: 'office-1',
      year: 2025,
      month: 10,
      electricityKwh: 40000,
      heatingFuelType: HeatingFuelType.NATURAL_GAS,
      totalEnergyConsumptionKWh: 50000,
      totalCarbonEmissionsKgCO2e: 10000,
    };

    const created = { id: 'es-1', ...dto };
    mockPrisma.officeEnergyStatement.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
    expect(prisma.officeEnergyStatement.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should return all energy statements', async () => {
    const list = [
      {
        officeId: 'office-1',
        year: 2025,
        month: 10,
        electricityKwh: 40000,
        heatingFuelType: HeatingFuelType.NATURAL_GAS,
        totalEnergyConsumptionKWh: 50000,
        totalCarbonEmissionsKgCO2e: 10000,
      },
    ];
    mockPrisma.officeEnergyStatement.findMany.mockResolvedValue(list);

    const result = await service.findAll();

    expect(result).toEqual(list);
    expect(prisma.officeEnergyStatement.findMany).toHaveBeenCalled();
  });

  it('should return one energy statement', async () => {
    const es = {
      officeId: 'office-1',
      year: 2025,
      month: 10,
      electricityKwh: 40000,
      heatingFuelType: HeatingFuelType.NATURAL_GAS,
      totalEnergyConsumptionKWh: 50000,
      totalCarbonEmissionsKgCO2e: 10000,
    };
    mockPrisma.officeEnergyStatement.findUnique.mockResolvedValue(es);

    const result = await service.findOne('es-1');

    expect(result).toEqual(es);
    expect(prisma.officeEnergyStatement.findUnique).toHaveBeenCalledWith({
      where: { id: 'es-1' },
    });
  });

  it('should throw NotFoundException if energy statement missing', async () => {
    mockPrisma.officeEnergyStatement.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('should update an energy statement', async () => {
    const existing = {
      id: 'es-1',
      officeId: 'office-1',
      year: 2024,
      month: 1,
      electricityKwh: 1234,
      heatingFuelType: HeatingFuelType.natural_gas,
      notes: null as string | null,
    };

    const dto = { notes: 'Updated notes' };
    const updated = { ...existing, ...dto };

    mockPrisma.officeEnergyStatement.findUnique.mockResolvedValue(existing);
    mockPrisma.officeEnergyStatement.update.mockResolvedValue(updated);

    const result = await service.update('es-1', dto);

    expect(result).toEqual(updated);
    expect(prisma.officeEnergyStatement.update).toHaveBeenCalledWith({
      where: { id: 'es-1' },
      data: dto,
    });
  });

  it('should delete an energy statement', async () => {
    const existing = { id: 'es-1' };
    mockPrisma.officeEnergyStatement.findUnique.mockResolvedValue(existing);
    mockPrisma.officeEnergyStatement.delete.mockResolvedValue(existing);

    const result = await service.remove('es-1');

    expect(result).toEqual(existing);
    expect(prisma.officeEnergyStatement.delete).toHaveBeenCalledWith({
      where: { id: 'es-1' },
    });
  });
});
