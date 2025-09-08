import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AppointmentTypeController } from '../../src/controllers/appointment-type.controller';
import { AppointmentTypeService } from '@/services/appointment-type.service';
import { AppointmentType, AppointmentTypeEnum } from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { CreateAppointmentTypeDto, UpdateAppointmentTypeDto } from '@/dto/appointment-type.dto';

describe('AppointmentTypeController', () => {
  let controller: AppointmentTypeController;
  let service: AppointmentTypeService;

  const mockAppointmentTypeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllIncludingInactive: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getPsychologistsByAppointmentType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentTypeController],
      providers: [
        {
          provide: AppointmentTypeService,
          useValue: mockAppointmentTypeService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentTypeController>(AppointmentTypeController);
    service = module.get<AppointmentTypeService>(AppointmentTypeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new appointment type', async () => {
      const createDto: CreateAppointmentTypeDto = {
        name: 'Online Consultation',
        code: AppointmentTypeEnum.ONLINE,
        description: 'Virtual consultation via video call',
        isActive: true,
      };

      const mockCreatedAppointmentType = createMockAppointmentType(1, 'Online Consultation', AppointmentTypeEnum.ONLINE, 'Virtual consultation via video call');

      mockAppointmentTypeService.create.mockResolvedValue(mockCreatedAppointmentType);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedAppointmentType);
      expect(mockAppointmentTypeService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create appointment type with minimal data', async () => {
      const createDto: CreateAppointmentTypeDto = {
        name: 'On-Site Consultation',
        code: AppointmentTypeEnum.ON_SITE,
      };

      const mockCreatedAppointmentType = createMockAppointmentType(1, 'On-Site Consultation', AppointmentTypeEnum.ON_SITE);

      mockAppointmentTypeService.create.mockResolvedValue(mockCreatedAppointmentType);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedAppointmentType);
      expect(mockAppointmentTypeService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create at-home appointment type', async () => {
      const createDto: CreateAppointmentTypeDto = {
        name: 'At Home Consultation',
        code: AppointmentTypeEnum.AT_HOME,
        description: 'Home visit consultation',
        isActive: true,
      };

      const mockCreatedAppointmentType = createMockAppointmentType(1, 'At Home Consultation', AppointmentTypeEnum.AT_HOME, 'Home visit consultation');

      mockAppointmentTypeService.create.mockResolvedValue(mockCreatedAppointmentType);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedAppointmentType);
      expect(mockAppointmentTypeService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create inactive appointment type', async () => {
      const createDto: CreateAppointmentTypeDto = {
        name: 'Inactive Type',
        code: AppointmentTypeEnum.ONLINE,
        isActive: false,
      };

      const mockCreatedAppointmentType = createMockAppointmentType(1, 'Inactive Type', AppointmentTypeEnum.ONLINE, undefined, false);

      mockAppointmentTypeService.create.mockResolvedValue(mockCreatedAppointmentType);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedAppointmentType);
      expect(mockAppointmentTypeService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all active appointment types', async () => {
      const mockAppointmentTypes = [
        createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE),
        createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE),
        createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME),
      ];

      mockAppointmentTypeService.findAll.mockResolvedValue(mockAppointmentTypes);

      const result = await controller.findAll();

      expect(result).toEqual(mockAppointmentTypes);
      expect(mockAppointmentTypeService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no active appointment types exist', async () => {
      mockAppointmentTypeService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllIncludingInactive', () => {
    it('should return all appointment types including inactive ones', async () => {
      const mockAppointmentTypes = [
        createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE, undefined, true),
        createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE, undefined, false),
        createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME, undefined, true),
      ];

      mockAppointmentTypeService.findAllIncludingInactive.mockResolvedValue(mockAppointmentTypes);

      const result = await controller.findAllIncludingInactive();

      expect(result).toEqual(mockAppointmentTypes);
      expect(mockAppointmentTypeService.findAllIncludingInactive).toHaveBeenCalled();
    });

    it('should return empty array when no appointment types exist', async () => {
      mockAppointmentTypeService.findAllIncludingInactive.mockResolvedValue([]);

      const result = await controller.findAllIncludingInactive();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an appointment type by ID', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

      mockAppointmentTypeService.findOne.mockResolvedValue(mockAppointmentType);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when appointment type not found', async () => {
      const error = new NotFoundException('Appointment type with ID 999 not found');
      mockAppointmentTypeService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });

    it('should throw NotFoundException when appointment type is inactive', async () => {
      const error = new NotFoundException('Appointment type with ID 1 not found');
      mockAppointmentTypeService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 1 not found')
      );
    });
  });

  describe('findByCode', () => {
    it('should return an appointment type by code', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

      mockAppointmentTypeService.findByCode.mockResolvedValue(mockAppointmentType);

      const result = await controller.findByCode('online');

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.findByCode).toHaveBeenCalledWith('online');
    });

    it('should return appointment type by on-site code', async () => {
      const mockAppointmentType = createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE);

      mockAppointmentTypeService.findByCode.mockResolvedValue(mockAppointmentType);

      const result = await controller.findByCode('on_site');

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.findByCode).toHaveBeenCalledWith('on_site');
    });

    it('should return appointment type by at-home code', async () => {
      const mockAppointmentType = createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME);

      mockAppointmentTypeService.findByCode.mockResolvedValue(mockAppointmentType);

      const result = await controller.findByCode('at_home');

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.findByCode).toHaveBeenCalledWith('at_home');
    });

    it('should throw NotFoundException when appointment type not found by code', async () => {
      mockAppointmentTypeService.findByCode.mockResolvedValue(null);

      await expect(controller.findByCode('nonexistent')).rejects.toThrow(
        new NotFoundException('Appointment type with code nonexistent not found')
      );
    });

    it('should throw NotFoundException when appointment type is inactive', async () => {
      mockAppointmentTypeService.findByCode.mockResolvedValue(null);

      await expect(controller.findByCode('online')).rejects.toThrow(
        new NotFoundException('Appointment type with code online not found')
      );
    });
  });

  describe('update', () => {
    it('should update an appointment type', async () => {
      const updateDto: UpdateAppointmentTypeDto = {
        name: 'Updated Online Consultation',
        description: 'Updated description',
      };

      const mockUpdatedAppointmentType = createMockAppointmentType(1, 'Updated Online Consultation', AppointmentTypeEnum.ONLINE, 'Updated description');

      mockAppointmentTypeService.update.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
      expect(mockAppointmentTypeService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update appointment type name', async () => {
      const updateDto: UpdateAppointmentTypeDto = {
        name: 'New Name',
      };

      const mockUpdatedAppointmentType = createMockAppointmentType(1, 'New Name', AppointmentTypeEnum.ONLINE);

      mockAppointmentTypeService.update.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
      expect(mockAppointmentTypeService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update appointment type code', async () => {
      const updateDto: UpdateAppointmentTypeDto = {
        code: AppointmentTypeEnum.ON_SITE,
      };

      const mockUpdatedAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ON_SITE);

      mockAppointmentTypeService.update.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
      expect(mockAppointmentTypeService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update appointment type description', async () => {
      const updateDto: UpdateAppointmentTypeDto = {
        description: 'New description',
      };

      const mockUpdatedAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE, 'New description');

      mockAppointmentTypeService.update.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
      expect(mockAppointmentTypeService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update appointment type active status', async () => {
      const updateDto: UpdateAppointmentTypeDto = {
        isActive: false,
      };

      const mockUpdatedAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE, undefined, false);

      mockAppointmentTypeService.update.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
      expect(mockAppointmentTypeService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when updating non-existent appointment type', async () => {
      const updateDto: UpdateAppointmentTypeDto = { name: 'Updated Name' };
      const error = new NotFoundException('Appointment type with ID 999 not found');

      mockAppointmentTypeService.update.mockRejectedValue(error);

      await expect(controller.update(999, updateDto)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });

    it('should handle empty update data', async () => {
      const updateDto: UpdateAppointmentTypeDto = {};
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

      mockAppointmentTypeService.update.mockResolvedValue(mockAppointmentType);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should soft delete an appointment type', async () => {
      mockAppointmentTypeService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockAppointmentTypeService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing non-existent appointment type', async () => {
      const error = new NotFoundException('Appointment type with ID 999 not found');

      mockAppointmentTypeService.remove.mockRejectedValue(error);

      await expect(controller.remove(999)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });
  });

  describe('getPsychologistsByAppointmentType', () => {
    it('should return psychologists offering a specific appointment type', async () => {
      const mockPsychologists = [
        createMockPsychologist(1, 'psychologist1@example.com', 'Dr. John', 'Smith'),
        createMockPsychologist(2, 'psychologist2@example.com', 'Dr. Jane', 'Doe'),
      ];

      mockAppointmentTypeService.getPsychologistsByAppointmentType.mockResolvedValue(mockPsychologists);

      const result = await controller.getPsychologistsByAppointmentType(1);

      expect(result).toEqual(mockPsychologists);
      expect(mockAppointmentTypeService.getPsychologistsByAppointmentType).toHaveBeenCalledWith(1);
    });

    it('should return empty array when no psychologists offer the appointment type', async () => {
      mockAppointmentTypeService.getPsychologistsByAppointmentType.mockResolvedValue([]);

      const result = await controller.getPsychologistsByAppointmentType(999);

      expect(result).toEqual([]);
      expect(mockAppointmentTypeService.getPsychologistsByAppointmentType).toHaveBeenCalledWith(999);
    });

    it('should return psychologists for online appointment type', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'online@example.com', 'Dr. Online', 'Specialist')];

      mockAppointmentTypeService.getPsychologistsByAppointmentType.mockResolvedValue(mockPsychologists);

      const result = await controller.getPsychologistsByAppointmentType(1);

      expect(result).toEqual(mockPsychologists);
      expect(mockAppointmentTypeService.getPsychologistsByAppointmentType).toHaveBeenCalledWith(1);
    });

    it('should return psychologists for on-site appointment type', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'onsite@example.com', 'Dr. OnSite', 'Specialist')];

      mockAppointmentTypeService.getPsychologistsByAppointmentType.mockResolvedValue(mockPsychologists);

      const result = await controller.getPsychologistsByAppointmentType(2);

      expect(result).toEqual(mockPsychologists);
      expect(mockAppointmentTypeService.getPsychologistsByAppointmentType).toHaveBeenCalledWith(2);
    });

    it('should return psychologists for at-home appointment type', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'athome@example.com', 'Dr. AtHome', 'Specialist')];

      mockAppointmentTypeService.getPsychologistsByAppointmentType.mockResolvedValue(mockPsychologists);

      const result = await controller.getPsychologistsByAppointmentType(3);

      expect(result).toEqual(mockPsychologists);
      expect(mockAppointmentTypeService.getPsychologistsByAppointmentType).toHaveBeenCalledWith(3);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors in create', async () => {
      const error = new Error('Database connection failed');
      const createDto: CreateAppointmentTypeDto = {
        name: 'Test',
        code: AppointmentTypeEnum.ONLINE,
      };

      mockAppointmentTypeService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findAll', async () => {
      const error = new Error('Database connection failed');
      mockAppointmentTypeService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findAllIncludingInactive', async () => {
      const error = new Error('Database connection failed');
      mockAppointmentTypeService.findAllIncludingInactive.mockRejectedValue(error);

      await expect(controller.findAllIncludingInactive()).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findOne', async () => {
      const error = new Error('Database connection failed');
      mockAppointmentTypeService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findByCode', async () => {
      const error = new Error('Database connection failed');
      mockAppointmentTypeService.findByCode.mockRejectedValue(error);

      await expect(controller.findByCode('online')).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in update', async () => {
      const error = new Error('Database connection failed');
      const updateDto: UpdateAppointmentTypeDto = { name: 'Updated' };

      mockAppointmentTypeService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in remove', async () => {
      const error = new Error('Database connection failed');
      mockAppointmentTypeService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in getPsychologistsByAppointmentType', async () => {
      const error = new Error('Database connection failed');
      mockAppointmentTypeService.getPsychologistsByAppointmentType.mockRejectedValue(error);

      await expect(controller.getPsychologistsByAppointmentType(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('parameter validation', () => {
    it('should handle string ID parameters', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

      mockAppointmentTypeService.findOne.mockResolvedValue(mockAppointmentType);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle special characters in codes', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

      mockAppointmentTypeService.findByCode.mockResolvedValue(mockAppointmentType);

      const result = await controller.findByCode('online');

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeService.findByCode).toHaveBeenCalledWith('online');
    });
  });
});

// Helper functions to create mock objects
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

function createMockPsychologist(
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  isActive: boolean = true
): Psychologist {
  return {
    id,
    email,
    firstName,
    lastName,
    phone: '+1234567890',
    licenseNumber: 'PSY123456',
    isActive,
    specializations: [],
    appointmentTypes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Psychologist;
}
