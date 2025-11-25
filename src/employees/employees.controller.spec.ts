import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmploymentType } from './enums/employment-type.enum';
import { WorkPattern } from './enums/work-patter.enum';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [{ provide: EmployeesService, useValue: mockService }],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const dto: CreateEmployeeDto = {
        email: 'alice@example.com',
        department: 'Engineering',
        employmentType: EmploymentType.FULL_TIME,
        workPattern: WorkPattern.HYBRID,
        officeId: 'office-1',
      };

      const created = { id: 'emp-1', ...dto };
      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should find pages employees', async () => {
      const query: ListEmployeesQueryDto = {
        page: 0,
        size: 10,
        sort: 'email,asc',
        officeId: undefined,
        department: undefined,
        employmentType: undefined,
        workPattern: undefined,
      };

      const response = {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        sort: { field: 'email', direction: 'asc' },
        filters: {
          officeId: null,
          department: null,
          employmentType: null,
          workPattern: null,
        },
      };
      mockService.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(result).toBe(response);
      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      const id = 'emp-1';
      const employee = {
        id,
        email: 'alice@example.com',
        department: 'Engineering',
      };

      mockService.findOne.mockResolvedValue(employee);

      const result = await controller.findOne(id);

      expect(result).toBe(employee);
      expect(mockService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const id = 'emp-1';
      const dto: UpdateEmployeeDto = {
        department: 'Platform',
      };

      const updated = {
        id,
        email: 'alice@example.com',
        department: 'Platform',
      };

      mockService.update.mockResolvedValue(updated);

      const result = await controller.update(id, dto);

      expect(result).toBe(updated);
      expect(mockService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      const id = 'emp-1';
      const removed = { id };

      mockService.remove.mockResolvedValue(removed);

      const result = await controller.remove(id);

      expect(result).toBe(removed);
      expect(mockService.remove).toHaveBeenCalledWith(id);
    });
  });
});
