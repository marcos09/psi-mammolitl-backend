import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PsychologistService } from '../../src/services/psychologist.service';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType, AppointmentTypeEnum } from '@/entities/appointment-type.entity';
import { Specialization } from '@/entities/specialization.entity';

describe('PsychologistService', () => {
  let service: PsychologistService;
  let psychologistRepository: Repository<Psychologist>;
  let appointmentTypeRepository: Repository<AppointmentType>;

  const mockPsychologistRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAppointmentTypeRepository = {
    findOne: jest.fn(),
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
        PsychologistService,
        {
          provide: getRepositoryToken(Psychologist),
          useValue: mockPsychologistRepository,
        },
        {
          provide: getRepositoryToken(AppointmentType),
          useValue: mockAppointmentTypeRepository,
        },
      ],
    }).compile();

    service = module.get<PsychologistService>(PsychologistService);
    psychologistRepository = module.get<Repository<Psychologist>>(
      getRepositoryToken(Psychologist),
    );
    appointmentTypeRepository = module.get<Repository<AppointmentType>>(
      getRepositoryToken(AppointmentType),
    );
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

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.findAll();

      expect(result).toEqual(mockPsychologists);
      expect(mockPsychologistRepository.createQueryBuilder).toHaveBeenCalledWith('psychologist');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('psychologist.appointmentTypes', 'appointmentType');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('psychologist.specializations', 'specialization');
    });

    it('should filter psychologists by appointment type ID', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];
      const filters = { appointmentTypeId: 1 };

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.findAll(filters);

      expect(result).toEqual(mockPsychologists);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'appointmentType.id = :appointmentTypeId',
        { appointmentTypeId: 1 }
      );
    });

    it('should filter psychologists by specialization ID', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];
      const filters = { specializationId: 2 };

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.findAll(filters);

      expect(result).toEqual(mockPsychologists);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'specialization.id = :specializationId',
        { specializationId: 2 }
      );
    });

    it('should filter psychologists by active status', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];
      const filters = { isActive: true };

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.findAll(filters);

      expect(result).toEqual(mockPsychologists);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'psychologist.isActive = :isActive',
        { isActive: true }
      );
    });

    it('should apply multiple filters', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];
      const filters = { 
        appointmentTypeId: 1, 
        specializationId: 2, 
        isActive: true 
      };

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.findAll(filters);

      expect(result).toEqual(mockPsychologists);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOne', () => {
    it('should return a psychologist by ID', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');
      
      mockPsychologistRepository.findOne.mockResolvedValue(mockPsychologist);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPsychologist);
      expect(mockPsychologistRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['appointmentTypes', 'specializations']
      });
    });

    it('should return null when psychologist not found', async () => {
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a psychologist by email', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');
      
      mockPsychologistRepository.findOne.mockResolvedValue(mockPsychologist);

      const result = await service.findByEmail('john@example.com');

      expect(result).toEqual(mockPsychologist);
      expect(mockPsychologistRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' }
      });
    });

    it('should return null when psychologist not found by email', async () => {
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByLicenseNumber', () => {
    it('should return a psychologist by license number', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe', 'PSY123456');
      
      mockPsychologistRepository.findOne.mockResolvedValue(mockPsychologist);

      const result = await service.findByLicenseNumber('PSY123456');

      expect(result).toEqual(mockPsychologist);
      expect(mockPsychologistRepository.findOne).toHaveBeenCalledWith({
        where: { licenseNumber: 'PSY123456' }
      });
    });

    it('should return null when psychologist not found by license number', async () => {
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.findByLicenseNumber('INVALID123');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new psychologist', async () => {
      const psychologistData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'Psychologist',
        phone: '+1234567890',
        licenseNumber: 'PSY789',
        isActive: true,
      };

      const mockCreatedPsychologist = createMockPsychologist(1, 'new@example.com', 'New', 'Psychologist', '+1234567890', 'PSY789');
      
      mockPsychologistRepository.create.mockReturnValue(mockCreatedPsychologist);
      mockPsychologistRepository.save.mockResolvedValue(mockCreatedPsychologist);

      const result = await service.create(psychologistData);

      expect(result).toEqual(mockCreatedPsychologist);
      expect(mockPsychologistRepository.create).toHaveBeenCalledWith(psychologistData);
      expect(mockPsychologistRepository.save).toHaveBeenCalledWith(mockCreatedPsychologist);
    });
  });

  describe('update', () => {
    it('should update a psychologist', async () => {
      const updateData = { firstName: 'Updated', lastName: 'Name' };
      const mockUpdatedPsychologist = createMockPsychologist(1, 'john@example.com', 'Updated', 'Name');
      
      mockPsychologistRepository.update.mockResolvedValue({ affected: 1 });
      mockPsychologistRepository.findOne.mockResolvedValue(mockUpdatedPsychologist);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockPsychologistRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['appointmentTypes', 'specializations']
      });
    });

    it('should return null when updating non-existent psychologist', async () => {
      const updateData = { firstName: 'Updated' };
      
      mockPsychologistRepository.update.mockResolvedValue({ affected: 0 });
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateData);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a psychologist', async () => {
      mockPsychologistRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockPsychologistRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('addAppointmentType', () => {
    it('should add appointment type to psychologist', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const mockUpdatedPsychologist = {
        ...mockPsychologist,
        appointmentTypes: [mockAppointmentType]
      };

      mockPsychologistRepository.findOne
        .mockResolvedValueOnce(mockPsychologist) // First call for finding psychologist
        .mockResolvedValueOnce(mockUpdatedPsychologist); // Second call for returning updated psychologist
      mockAppointmentTypeRepository.findOne.mockResolvedValue(mockAppointmentType);
      mockPsychologistRepository.save.mockResolvedValue(mockUpdatedPsychologist);

      const result = await service.addAppointmentType(1, 1);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['appointmentTypes']
      });
      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return null when psychologist not found', async () => {
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.addAppointmentType(999, 1);

      expect(result).toBeNull();
      expect(mockAppointmentTypeRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null when appointment type not found', async () => {
      const mockPsychologist = createMockPsychologist(1, 'john@example.com', 'John', 'Doe');
      
      mockPsychologistRepository.findOne.mockResolvedValue(mockPsychologist);
      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      const result = await service.addAppointmentType(1, 999);

      expect(result).toBeNull();
    });

    it('should not add duplicate appointment type', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const mockPsychologist = {
        ...createMockPsychologist(1, 'john@example.com', 'John', 'Doe'),
        appointmentTypes: [mockAppointmentType]
      };
      const mockUpdatedPsychologist = {
        ...mockPsychologist,
        appointmentTypes: [mockAppointmentType]
      };

      mockPsychologistRepository.findOne
        .mockResolvedValueOnce(mockPsychologist) // First call for finding psychologist
        .mockResolvedValueOnce(mockUpdatedPsychologist); // Second call for returning updated psychologist
      mockAppointmentTypeRepository.findOne.mockResolvedValue(mockAppointmentType);

      const result = await service.addAppointmentType(1, 1);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('removeAppointmentType', () => {
    it('should remove appointment type from psychologist', async () => {
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      const mockPsychologist = {
        ...createMockPsychologist(1, 'john@example.com', 'John', 'Doe'),
        appointmentTypes: [mockAppointmentType]
      };
      const mockUpdatedPsychologist = {
        ...mockPsychologist,
        appointmentTypes: []
      };

      mockPsychologistRepository.findOne
        .mockResolvedValueOnce(mockPsychologist) // First call for finding psychologist
        .mockResolvedValueOnce(mockUpdatedPsychologist); // Second call for returning updated psychologist
      mockPsychologistRepository.save.mockResolvedValue(mockUpdatedPsychologist);

      const result = await service.removeAppointmentType(1, 1);

      expect(result).toEqual(mockUpdatedPsychologist);
      expect(mockPsychologistRepository.save).toHaveBeenCalledWith({
        ...mockPsychologist,
        appointmentTypes: []
      });
    });

    it('should return null when psychologist not found', async () => {
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.removeAppointmentType(999, 1);

      expect(result).toBeNull();
    });
  });

  describe('getPsychologistsByAppointmentType', () => {
    it('should return psychologists offering specific appointment type', async () => {
      const mockPsychologists = [createMockPsychologist(1, 'john@example.com', 'John', 'Doe')];

      mockPsychologistRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockPsychologists);

      const result = await service.getPsychologistsByAppointmentType(1);

      expect(result).toEqual(mockPsychologists);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'appointmentType.id = :appointmentTypeId',
        { appointmentTypeId: 1 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'psychologist.isActive = :isActive',
        { isActive: true }
      );
    });
  });

  describe('getAvailableAppointmentTypes', () => {
    it('should return appointment types for psychologist', async () => {
      const mockAppointmentTypes = [
        createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE),
        createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE)
      ];
      const mockPsychologist = {
        ...createMockPsychologist(1, 'john@example.com', 'John', 'Doe'),
        appointmentTypes: mockAppointmentTypes
      };

      mockPsychologistRepository.findOne.mockResolvedValue(mockPsychologist);

      const result = await service.getAvailableAppointmentTypes(1);

      expect(result).toEqual(mockAppointmentTypes);
      expect(mockPsychologistRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['appointmentTypes']
      });
    });

    it('should return empty array when psychologist not found', async () => {
      mockPsychologistRepository.findOne.mockResolvedValue(null);

      const result = await service.getAvailableAppointmentTypes(999);

      expect(result).toEqual([]);
    });

    it('should return empty array when psychologist has no appointment types', async () => {
      const mockPsychologist = {
        ...createMockPsychologist(1, 'john@example.com', 'John', 'Doe'),
        appointmentTypes: []
      };

      mockPsychologistRepository.findOne.mockResolvedValue(mockPsychologist);

      const result = await service.getAvailableAppointmentTypes(1);

      expect(result).toEqual([]);
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
