import { Test, TestingModule } from '@nestjs/testing';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { create } from 'domain';

describe('OfficesController', () => {
  let controller: OfficesController;
  let service: OfficesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficesController],
      providers: [{ provide: OfficesService, useValue: mockService }],
    }).compile();

    controller = module.get<OfficesController>(OfficesController);
    service = module.get<OfficesService>(OfficesService);
    jest.clearAllMocks();
  });

  it('should create an office', async () => {
    const dto = { code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' };
    const created = { id: 1, ...dto };
    mockService.create.mockResolvedValue(created);

    expect(await controller.create(dto)).toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find all offices', async () => {
    const offices = [
      { id: 1, code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' },
      { id: 2, code: 'NYC-01', name: 'New York Office', gridRegionCode: 'US-NY' },
    ];
    mockService.findAll.mockResolvedValue(offices);

    expect(await controller.findAll()).toEqual(offices);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one office by id', async () => {
    const office = { id: '1', code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' };
    mockService.findOne.mockResolvedValue(office);

    expect(await controller.findOne('1')).toEqual(office);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update an office', async () => {
    const dto = { name: 'Updated London Office' };
    const updated = {
      id: '1',
      code: 'LON-01',
      name: 'Updated London Office',
      gridRegionCode: 'UK-GB-L',
    };
    mockService.update.mockResolvedValue(updated);

    expect(await controller.update('1', dto)).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove an office', async () => {
    const removed = { id: '1', code: 'LON-01', name: 'London Office', gridRegionCode: 'UK-GB-L' };
    mockService.remove.mockResolvedValue(removed);

    expect(await controller.remove('1')).toEqual(removed);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
