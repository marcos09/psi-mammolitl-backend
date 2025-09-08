import { Test, TestingModule } from '@nestjs/testing';
import { PsychologistController } from '../../src/controllers/psychologist.controller';
import { PsychologistService } from '@/services/psychologist.service';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType, AppointmentTypeEnum } from '@/entities/appointment-type.entity';
import { Specialization } from '@/entities/specialization.entity';
import { CreatePsychologistDto, UpdatePsychologistDto } from '@/dto/psychologist.dto';

describe('PsychologistController', () => {
  let controller: PsychologistController;
  let service: PsychologistService;

  const mockPsychologistService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAvailableAppointmentTypes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsychologistController],
      providers: [
        {
          provide: PsychologistService,
          useValue: mockPsychologistService,
        },
      ],
    }).compile();

    controller = module.get<PsychologistController>(PsychologistController);
    service = module.get<PsychologistService>(PsychologistService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all psychologists without filters', async () => {
      const mockPsychologists = [
        createMockPsychologist(1, 'john@example.com', 'John', 'Doe'),
        createMockPsychologist(2, 'jane@example.com', 'Jane', 'Smith'),
      ];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll();

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({});
    });

    it('should filter psychologists by appointment type ID', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll('1');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: 1,
        specializationId: undefined,
        isActive: undefined,
      });
    });

    it('should filter psychologists by specialization ID', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll(undefined, '2');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: undefined,
        specializationId: 2,
        isActive: undefined,
      });
    });

    it('should filter psychologists by active status', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll(undefined, undefined, 'true');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: undefined,
        specializationId: undefined,
        isActive: true,
      });
    });

    it('should filter psychologists by inactive status', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe', undefined, undefined, false)];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll(undefined, undefined, 'false');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: undefined,
        specializationId: undefined,
        isActive: false,
      });
    });

    it('should apply multiple filters', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll('1', '2', 'true');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: 1,
        specializationId: 2,
        isActive: true,
      });
    });

    it('should handle empty string filters', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll('', '', '');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: undefined,
        specializationId: undefined,
        isActive: false, // Empty string is converted to false
      });
    });

    it('should return empty array when no psychologists found', async () => {
      mockPsychologistService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a psychologist by ID', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');

      mockPsychologistService.findOne.mockResolvedValue(mockPsychologist);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPsychologist);
      expect(mockPsychologistService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when psychologist not found', async () => {
      mockPsychologistService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockPsychologistService.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle string ID parameter', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');

      mockPsychologistService.findOne.mockResolvedValue(mockPsychologist);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPsychologist);
      expect(mockPsychologistService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new psychologist', async () => {
      const createDto: CreatePsychologistDto = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'Psychologist',
        phone: '+1234567890',
        licenseNumber: 'PSY789',
        isActive: true,
      };

      const mockCreatedPsychologist = createMockPsychologist(1, 'new@example.com', 'New', 'Psychologist', '+1234567890', 'PSY789');

      mockPsychologistService.create.mockResolvedValue(mockCreatedPsychologist);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedPsychologist);
      expect(mockPsychologistService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create psychologist with minimal data', async () => {
      const createDto: CreatePsychologistDto = {
        email: 'minimal@example.com',
        firstName: 'Minimal',
        lastName: 'User',
      };

      const mockCreatedPsychologist = createMockPsychologist(1, 'minimal@example.com', 'Minimal', 'User');

      mockPsychologistService.create.mockResolvedValue(mockCreatedPsychologist);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedPsychologist);
      expect(mockPsychologistService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create inactive psychologist', async () => {
      const createDto: CreatePsychologistDto = {
        email: 'inactive@example.com',
        firstName: 'Inactive',
        lastName: 'User',
        isActive: false,
      };

      const mockCreatedPsychologist = createMockPsychologist(1, 'inactive@example.com', 'Inactive', 'User', undefined, undefined, false);

      mockPsychologistService.create.mockResolvedValue(mockCreatedPsychologist);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedPsychologist);
      expect(mockPsychologistService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create psychologist with specializations', async () => {
      const createDto: CreatePsychologistDto = {
        email: 'specialized@example.com',
        firstName: 'Specialized',
        lastName: 'User',
        specializationIds: [1, 2, 3],
      };

      const mockCreatedPsychologist = createMockPsychologist(1, 'specialized@example.com', 'Specialized', 'User');

      mockPsychologistService.create.mockResolvedValue(mockCreatedPsychologist);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedPsychologist);
      expect(mockPsychologistService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a psychologist', async () => {
      const updateDto: UpdatePsychologistDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const mockUpdatedPsychologist = createMockPsychologist(1, 'john@example.com', 'Updated', 'Name');

      mockPsychologistService.update.mockResolvedValue(mockUpdatedPsychologist);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update email', async () => {
      const updateDto: UpdatePsychologistDto = {
        email: 'newemail@example.com',
      };

      const mockUpdatedPsychologist = createMockPsychologist(1, 'newemail@example.com', 'John', 'Doe');

      mockPsychologistService.update.mockResolvedValue(mockUpdatedPsychologist);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update phone number', async () => {
      const updateDto: UpdatePsychologistDto = {
        phone: '+9876543210',
      };

      const mockUpdatedPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe', '+9876543210');

      mockPsychologistService.update.mockResolvedValue(mockUpdatedPsychologist);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update license number', async () => {
      const updateDto: UpdatePsychologistDto = {
        licenseNumber: 'PSY999999',
      };

      const mockUpdatedPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe', undefined, 'PSY999999');

      mockPsychologistService.update.mockResolvedValue(mockUpdatedPsychologist);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update active status', async () => {
      const updateDto: UpdatePsychologistDto = {
        isActive: false,
      };

      const mockUpdatedPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe', undefined, undefined, false);

      mockPsychologistService.update.mockResolvedValue(mockUpdatedPsychologist);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should return null when updating non-existent psychologist', async () => {
      const updateDto: UpdatePsychologistDto = {
        firstName: 'Updated',
      };

      mockPsychologistService.update.mockResolvedValue(null);

      const result = await controller.update(999, updateDto);

      expect(result).toBeNull();
      expect(mockPsychologistService.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('should handle empty update data', async () => {
      const updateDto: UpdatePsychologistDto = {};
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');

      mockPsychologistService.update.mockResolvedValue(mockPsychologist);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockPsychologist);
      expect(mockPsychologistService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a psychologist', async () => {
      mockPsychologistService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({ message: 'Psychologist deleted successfully' });
      expect(mockPsychologistService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of non-existent psychologist', async () => {
      mockPsychologistService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(999);

      expect(result).toEqual({ message: 'Psychologist deleted successfully' });
      expect(mockPsychologistService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('getAppointmentTypes', () => {
    it('should return available appointment types for a psychologist', async () => {
      const mockAppointmentTypes = [
        createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE),
        createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE),
      ];

      mockPsychologistService.getAvailableAppointmentTypes.mockResolvedValue(mockAppointmentTypes);

      const result = await controller.getAppointmentTypes(1);

      expect(result).toEqual(mockAppointmentTypes);
      expect(mockPsychologistService.getAvailableAppointmentTypes).toHaveBeenCalledWith(1);
    });

    it('should return empty array when psychologist has no appointment types', async () => {
      mockPsychologistService.getAvailableAppointmentTypes.mockResolvedValue([]);

      const result = await controller.getAppointmentTypes(1);

      expect(result).toEqual([]);
      expect(mockPsychologistService.getAvailableAppointmentTypes).toHaveBeenCalledWith(1);
    });

    it('should return empty array when psychologist not found', async () => {
      mockPsychologistService.getAvailableAppointmentTypes.mockResolvedValue([]);

      const result = await controller.getAppointmentTypes(999);

      expect(result).toEqual([]);
      expect(mockPsychologistService.getAvailableAppointmentTypes).toHaveBeenCalledWith(999);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors in findAll', async () => {
      const error = new Error('Database connection failed');
      mockPsychologistService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findOne', async () => {
      const error = new Error('Database connection failed');
      mockPsychologistService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in create', async () => {
      const error = new Error('Database connection failed');
      const createDto: CreatePsychologistDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPsychologistService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in update', async () => {
      const error = new Error('Database connection failed');
      const updateDto: UpdatePsychologistDto = { firstName: 'Updated' };

      mockPsychologistService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in remove', async () => {
      const error = new Error('Database connection failed');
      mockPsychologistService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in getAppointmentTypes', async () => {
      const error = new Error('Database connection failed');
      mockPsychologistService.getAvailableAppointmentTypes.mockRejectedValue(error);

      await expect(controller.getAppointmentTypes(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('parameter validation', () => {
    it('should handle invalid appointment type ID filter', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll('invalid');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: NaN,
        specializationId: undefined,
        isActive: undefined,
      });
    });

    it('should handle invalid specialization ID filter', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll(undefined, 'invalid');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: undefined,
        specializationId: NaN,
        isActive: undefined,
      });
    });

    it('should handle invalid boolean filter', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistService.findAll.mockResolvedValue(mockPsychologists);

      const result = await controller.findAll(undefined, undefined, 'invalid');

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistService.findAll).toHaveBeenCalledWith({
        appointmentTypeId: undefined,
        specializationId: undefined,
        isActive: false,
      });
    });
  });
});

// Helper functions to create mock objects
function createMockPsychologist(
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  phone?: string,
  licenseNumber?: string,
  isActive: boolean = true
): Psychologist {
  return {
    id,
    email,
    firstName,
    lastName,
    phone,
    licenseNumber,
    isActive,
    specializations: [],
    appointmentTypes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Psychologist;
}

function createMockAppointmentType(
  id: number,
  name: string,
  code: AppointmentTypeEnum,
  description?: string,
  isActive: boolean = true
): AppointmentType {
  return {
    id,
    name,
    code,
    description,
    isActive,
    psychologists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as AppointmentType;
}
