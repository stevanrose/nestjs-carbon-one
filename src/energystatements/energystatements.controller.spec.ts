import { Test, TestingModule } from '@nestjs/testing';
import { EnergystatementsController } from './energystatements.controller';
import { EnergystatementsService } from './energystatements.service';
import { CreateEnergystatementDto } from './dto/create-energystatement.dto';
import { UpdateEnergystatementDto } from './dto/update-energystatement.dto';

import { checkServerIdentity } from 'tls';
import { HeatingFuelType } from './dto/enums/heating-fuel-type.enum';

describe('EnergystatementsController', () => {
  let controller: EnergystatementsController;
  let service: EnergystatementsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnergystatementsController],
      providers: [{ provide: EnergystatementsService, useValue: mockService }],
    }).compile();

    controller = module.get<EnergystatementsController>(EnergystatementsController);
    service = module.get<EnergystatementsService>(EnergystatementsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an energy statement', async () => {
      const dto: CreateEnergystatementDto = {
        officeId: 'office-1',
        year: 2024,
        month: 1,
        electricityKwh: 1234,
        heatingFuelType: HeatingFuelType.NATURAL_GAS,
        heatingEnergyKwh: 500,
        renewablePpasKwh: 100,
        notes: 'Initial',
      };

      const created = { id: 'es-1', ...dto };
      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    describe('findAll', () => {
      it('should find paged energy statements', async () => {
        const list = [{ id: 'es-1' }, { id: 'es-2' }];

        mockService.findAll.mockResolvedValue(list);

        const result = await controller.findAll();
        expect(result).toBe(list);

        expect(mockService.findAll).toHaveBeenCalled();
      });
    });

    describe('findOne', () => {
      it('should find one energy statement by ID', async () => {
        const es = { id: 'es-1' };
        mockService.findOne.mockResolvedValue(es);

        const result = await controller.findOne('es-1');
        expect(result).toBe(es);
        expect(mockService.findOne).toHaveBeenCalledWith('es-1');
      });
    });
    describe('update', () => {
      it('should update an energy statement', async () => {
        const dto: UpdateEnergystatementDto = {
          electricityKwh: 1500,
          notes: 'Updated',
        };
        const updated = { id: 'es-1', ...dto };
        mockService.update.mockResolvedValue(updated);

        const result = await controller.update('es-1', dto);
        expect(result).toEqual(updated);
        expect(service.update).toHaveBeenCalledWith('es-1', dto);
      });

      describe('remove', () => {
        it('should remove an energy statement', async () => {
          const deleted = { id: 'es-1' };
          mockService.remove.mockResolvedValue(deleted);

          const result = await controller.remove('es-1');
          expect(result).toEqual(deleted);
          expect(service.remove).toHaveBeenCalledWith('es-1');
        });
      });
    });
  });
});
