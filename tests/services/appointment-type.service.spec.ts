import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AppointmentTypeService } from '../../src/services/appointment-type.service';
import { AppointmentType, AppointmentTypeEnum } from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { CreateAppointmentTypeDto, UpdateAppointmentTypeDto } from '@/dto/appointment-type.dto';

describe('AppointmentTypeService', () => {
  let service: AppointmentTypeService;
  let appointmentTypeRepository: Repository<AppointmentType>;
  let psychologistRepository: Repository<Psychologist>;

  const mockAppointmentTypeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPsychologistRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentTypeService,
        {
          provide: getRepositoryToken(AppointmentType),
          useValue: mockAppointmentTypeRepository,
        },
        {
          provide: getRepositoryToken(Psychologist),
          useValue: mockPsychologistRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentTypeService>(AppointmentTypeService);
    appointmentTypeRepository = module.get<Repository<AppointmentType>>(getRepositoryToken(AppointmentType));
    psychologistRepository = module.get<Repository<Psychologist>>(getRepositoryToken(Psychologist));
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
      
      mockAppointmentTypeRepository.create.mockReturnValue(mockCreatedAppointmentType);
      mockAppointmentTypeRepository.save.mockResolvedValue(mockCreatedAppointmentType);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreatedAppointmentType);
      expect(mockAppointmentTypeRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockAppointmentTypeRepository.save).toHaveBeenCalledWith(mockCreatedAppointmentType);
    });

    it('should create appointment type with minimal data', async () => {
      const createDto: CreateAppointmentTypeDto = {
        name: 'On-Site Consultation',
        code: AppointmentTypeEnum.ON_SITE,
      };

      const mockCreatedAppointmentType = createMockAppointmentType(1, 'On-Site Consultation', AppointmentTypeEnum.ON_SITE);
      
      mockAppointmentTypeRepository.create.mockReturnValue(mockCreatedAppointmentType);
      mockAppointmentTypeRepository.save.mockResolvedValue(mockCreatedAppointmentType);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreatedAppointmentType);
    });
  });

  describe('findAll', () => {
    it('should return all active appointment types ordered by name', async () => {
      const mockAppointmentTypes = [
        createMockAppointmentType(1, 'At Home', AppointmentTypeEnum.AT_HOME),
        createMockAppointmentType(2, 'Online', AppointmentTypeEnum.ONLINE),
        createMockAppointmentType(3, 'On-Site', AppointmentTypeEnum.ON_SITE),
      ];

      mockAppointmentTypeRepository.find.mockResolvedValue(mockAppointmentTypes);

      const result = await service.findAll();

      expect(result).toEqual(mockAppointmentTypes);
      expect(mockAppointmentTypeRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    });

    it('should return empty array when no active appointment types exist', async () => {
      mockAppointmentTypeRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an active appointment type by ID', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(mockAppointmentType);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
    });

    it('should throw NotFoundException when appointment type not found', async () => {
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });

    it('should throw NotFoundException when appointment type is inactive', async () => {
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 1 not found')
      );
    });
  });

  describe('findByCode', () => {
    it('should return an active appointment type by code', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(mockAppointmentType);

      const result = await service.findByCode('online');

      expect(result).toEqual(mockAppointmentType);
      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { code: AppointmentTypeEnum.ONLINE, isActive: true },
      });
    });

    it('should return null when appointment type not found by code', async () => {
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCode('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null when appointment type is inactive', async () => {
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCode('online');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an appointment type', async () => {
      const existingAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const updateDto: UpdateAppointmentTypeDto = {
        name: 'Updated Online Consultation',
        description: 'Updated description',
      };
      const mockUpdatedAppointmentType = {
        ...existingAppointmentType,
        name: 'Updated Online Consultation',
        description: 'Updated description',
      };
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(existingAppointmentType);
      mockAppointmentTypeRepository.save.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(mockAppointmentTypeRepository.save).toHaveBeenCalledWith(mockUpdatedAppointmentType);
    });

    it('should update appointment type code', async () => {
      const existingAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const updateDto: UpdateAppointmentTypeDto = {
        code: AppointmentTypeEnum.ON_SITE,
      };
      const mockUpdatedAppointmentType = {
        ...existingAppointmentType,
        code: AppointmentTypeEnum.ON_SITE,
      };
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(existingAppointmentType);
      mockAppointmentTypeRepository.save.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
    });

    it('should update appointment type active status', async () => {
      const existingAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const updateDto: UpdateAppointmentTypeDto = {
        isActive: false,
      };
      const mockUpdatedAppointmentType = {
        ...existingAppointmentType,
        isActive: false,
      };
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(existingAppointmentType);
      mockAppointmentTypeRepository.save.mockResolvedValue(mockUpdatedAppointmentType);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAppointmentType);
    });

    it('should throw NotFoundException when updating non-existent appointment type', async () => {
      const updateDto: UpdateAppointmentTypeDto = { name: 'Updated Name' };
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });
  });

  describe('remove', () => {
    it('should soft delete an appointment type by setting isActive to false', async () => {
      const existingAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const softDeletedAppointmentType = {
        ...existingAppointmentType,
        isActive: false,
      };
      
      mockAppointmentTypeRepository.findOne.mockResolvedValue(existingAppointmentType);
      mockAppointmentTypeRepository.save.mockResolvedValue(softDeletedAppointmentType);

      await service.remove(1);

      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(mockAppointmentTypeRepository.save).toHaveBeenCalledWith(softDeletedAppointmentType);
    });

    it('should throw NotFoundException when removing non-existent appointment type', async () => {
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });
  });

  describe('findAllIncludingInactive', () => {
    it('should return all appointment types including inactive ones', async () => {
      const mockAppointmentTypes = [
        createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE, undefined, true),
        createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE, undefined, false),
        createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME, undefined, true),
      ];

      mockAppointmentTypeRepository.find.mockResolvedValue(mockAppointmentTypes);

      const result = await service.findAllIncludingInactive();

      expect(result).toEqual(mockAppointmentTypes);
      expect(mockAppointmentTypeRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });

    it('should return empty array when no appointment types exist', async () => {
      mockAppointmentTypeRepository.find.mockResolvedValue([]);

      const result = await service.findAllIncludingInactive();

      expect(result).toEqual([]);
    });
  });

  describe('getPsychologistsByAppointmentType', () => {
    it('should return active psychologists offering a specific appointment type', async () => {
      const mockPsychologists = [
        createMockPsychologist(1, 'psychologist1@example.com', 'Dr. John', 'Smith'),
        createMockPsychologist(2, 'psychologist2@example.com', 'Dr. Jane', 'Doe'),
      ];

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.getPsychologistsByAppointmentType(1);

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistRepository.createQueryBuilder).toHaveBeenCalledWith('psychologist');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('psychologist.appointmentTypes', 'appointmentType');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('psychologist.specializations', 'specialization');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('appointmentType.id = :appointmentTypeId', { appointmentTypeId: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('psychologist.isActive = :isActive', { isActive: true });
    });

    it('should return empty array when no psychologists offer the appointment type', async () => {
      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getPsychologistsByAppointmentType(999);

      expect(result).toEqual([]);
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
