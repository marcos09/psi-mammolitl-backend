import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TimeSlotService } from '../../src/services/timeslot.service';
import { TimeSlot } from '@/entities/timeslot.entity';
import { AppointmentType, AppointmentTypeEnum } from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { Specialization } from '@/entities/specialization.entity';
import { CreateTimeSlotDto } from '@/dto/timeslot.dto';

describe('TimeSlotService', () => {
  let service: TimeSlotService;
  let timeSlotRepository: Repository<TimeSlot>;
  let appointmentTypeRepository: Repository<AppointmentType>;

  const mockTimeSlotRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAppointmentTypeRepository = {
    findOne: jest.fn(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeSlotService,
        {
          provide: getRepositoryToken(TimeSlot),
          useValue: mockTimeSlotRepository,
        },
        {
          provide: getRepositoryToken(AppointmentType),
          useValue: mockAppointmentTypeRepository,
        },
      ],
    }).compile();

    service = module.get<TimeSlotService>(TimeSlotService);
    timeSlotRepository = module.get<Repository<TimeSlot>>(getRepositoryToken(TimeSlot));
    appointmentTypeRepository = module.get<Repository<AppointmentType>>(getRepositoryToken(AppointmentType));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all time slots', async () => {
      const mockTimeSlots = [
        createMockTimeSlot(1, 1, 1, true),
        createMockTimeSlot(2, 1, 2, false),
      ];

      mockTimeSlotRepository.find.mockResolvedValue(mockTimeSlots);

      const result = await service.findAll();

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a time slot by ID', async () => {
      const mockTimeSlot = createMockTimeSlot(1, 1, 1, true);
      
      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTimeSlot);
      expect(mockTimeSlotRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when time slot not found', async () => {
      mockTimeSlotRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

    beforeEach(() => {
      mockAppointmentTypeRepository.findOne.mockResolvedValue(mockAppointmentType);
    });

    it('should create a time slot successfully for online appointment', async () => {
      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        isAvailable: true,
        notes: 'Morning consultation',
        psychologistId: 1,
        appointmentTypeId: 1,
        meetingLink: 'https://meet.google.com/test',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 1, true);
      
      mockTimeSlotRepository.create.mockReturnValue(mockCreatedTimeSlot);
      mockTimeSlotRepository.save.mockResolvedValue(mockCreatedTimeSlot);

      const result = await service.create(timeSlotData);

      expect(result).toEqual(mockCreatedTimeSlot);
      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(mockTimeSlotRepository.create).toHaveBeenCalledWith(timeSlotData);
      expect(mockTimeSlotRepository.save).toHaveBeenCalledWith(mockCreatedTimeSlot);
    });

    it('should create a time slot successfully for on-site appointment', async () => {
      const onSiteAppointmentType = createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE);
      mockAppointmentTypeRepository.findOne.mockResolvedValue(onSiteAppointmentType);

      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 2,
        address: '123 Main St, City, State 12345',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 2, true);
      
      mockTimeSlotRepository.create.mockReturnValue(mockCreatedTimeSlot);
      mockTimeSlotRepository.save.mockResolvedValue(mockCreatedTimeSlot);

      const result = await service.create(timeSlotData);

      expect(result).toEqual(mockCreatedTimeSlot);
    });

    it('should create a time slot successfully for at-home appointment', async () => {
      const atHomeAppointmentType = createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME);
      mockAppointmentTypeRepository.findOne.mockResolvedValue(atHomeAppointmentType);

      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 3,
        address: '456 Client St, Client City, State 54321',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 3, true);
      
      mockTimeSlotRepository.create.mockReturnValue(mockCreatedTimeSlot);
      mockTimeSlotRepository.save.mockResolvedValue(mockCreatedTimeSlot);

      const result = await service.create(timeSlotData);

      expect(result).toEqual(mockCreatedTimeSlot);
    });

    it('should throw BadRequestException when appointment type is required', async () => {
      const timeSlotData = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        // Missing appointmentTypeId
      } as CreateTimeSlotDto;

      await expect(service.create(timeSlotData)).rejects.toThrow(
        new BadRequestException('Appointment type is required')
      );
    });

    it('should throw NotFoundException when appointment type not found', async () => {
      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 999,
      };

      mockAppointmentTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.create(timeSlotData)).rejects.toThrow(
        new NotFoundException('Appointment type with ID 999 not found')
      );
    });

    it('should throw BadRequestException when meeting link is required for online appointments', async () => {
      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 1,
        // Missing meetingLink
      };

      await expect(service.create(timeSlotData)).rejects.toThrow(
        new BadRequestException('Meeting link is required for online appointments')
      );
    });

    it('should throw BadRequestException when address is required for on-site appointments', async () => {
      const onSiteAppointmentType = createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE);
      mockAppointmentTypeRepository.findOne.mockResolvedValue(onSiteAppointmentType);

      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 2,
        // Missing address
      };

      await expect(service.create(timeSlotData)).rejects.toThrow(
        new BadRequestException('Address is required for on-site and at-home appointments')
      );
    });

    it('should throw BadRequestException when address is required for at-home appointments', async () => {
      const atHomeAppointmentType = createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME);
      mockAppointmentTypeRepository.findOne.mockResolvedValue(atHomeAppointmentType);

      const timeSlotData: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 3,
        // Missing address
      };

      await expect(service.create(timeSlotData)).rejects.toThrow(
        new BadRequestException('Address is required for on-site and at-home appointments')
      );
    });
  });

  describe('update', () => {
    it('should update a time slot', async () => {
      const updateData = { notes: 'Updated notes', isAvailable: false };
      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, false);
      
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });
      mockTimeSlotRepository.findOne.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should validate appointment type when updating appointment type', async () => {
      const onSiteAppointmentType = createMockAppointmentType(2, 'On-Site', AppointmentTypeEnum.ON_SITE);
      mockAppointmentTypeRepository.findOne.mockResolvedValue(onSiteAppointmentType);

      const updateData = { 
        appointmentTypeId: 2,
        address: '123 Main St, City, State 12345',
        notes: 'Updated notes' 
      };
      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 2, true);
      
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });
      mockTimeSlotRepository.findOne.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockAppointmentTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2, isActive: true },
      });
    });

    it('should return null when updating non-existent time slot', async () => {
      const updateData = { notes: 'Updated notes' };
      
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 0 });
      mockTimeSlotRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateData);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a time slot', async () => {
      mockTimeSlotRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockTimeSlotRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('markAsUnavailable', () => {
    it('should mark time slot as unavailable', async () => {
      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, false);
      
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });
      mockTimeSlotRepository.findOne.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await service.markAsUnavailable(1);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotRepository.update).toHaveBeenCalledWith(1, { isAvailable: false });
    });

    it('should return null when marking non-existent time slot as unavailable', async () => {
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 0 });
      mockTimeSlotRepository.findOne.mockResolvedValue(null);

      const result = await service.markAsUnavailable(999);

      expect(result).toBeNull();
    });
  });

  describe('markAsAvailable', () => {
    it('should mark time slot as available', async () => {
      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, true);
      
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });
      mockTimeSlotRepository.findOne.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await service.markAsAvailable(1);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotRepository.update).toHaveBeenCalledWith(1, { isAvailable: true });
    });

    it('should return null when marking non-existent time slot as available', async () => {
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 0 });
      mockTimeSlotRepository.findOne.mockResolvedValue(null);

      const result = await service.markAsAvailable(999);

      expect(result).toBeNull();
    });
  });

  describe('findWithFilters', () => {
    it('should return time slots with default filters (available only)', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({});

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.isAvailable = :isAvailable',
        { isAvailable: true }
      );
    });

    it('should filter by psychologist ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({ psychologistId: 1 });

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.psychologistId = :psychologistId',
        { psychologistId: 1 }
      );
    });

    it('should filter by specialization ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({ specializationId: 1 });

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'psychologist.specializations',
        'specialization'
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'specialization.id = :specializationId',
        { specializationId: 1 }
      );
    });

    it('should filter by appointment type ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({ appointmentTypeId: 1 });

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.appointmentTypeId = :appointmentTypeId',
        { appointmentTypeId: 1 }
      );
    });

    it('should filter by availability status', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, false)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({ isAvailable: false });

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.isAvailable = :isAvailable',
        { isAvailable: false }
      );
    });

    it('should filter by future only', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({ futureOnly: true });

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.startTime > :now',
        { now: expect.any(Date) }
      );
    });

    it('should filter by date range', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-31T23:59:59Z');
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters({ startDate, endDate });

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.startTime >= :startDate',
        { startDate }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.startTime <= :endDate',
        { endDate }
      );
    });

    it('should apply multiple filters', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const filters = {
        psychologistId: 1,
        specializationId: 2,
        appointmentTypeId: 1,
        isAvailable: true,
        futureOnly: true,
        startDate: new Date('2024-01-15T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
      };
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findWithFilters(filters);

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(7); // 7 filters applied (including default isAvailable filter)
    });

    it('should order by start time ascending', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      await service.findWithFilters({});

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('timeSlot.startTime', 'ASC');
    });
  });

  describe('findAvailableFuture', () => {
    it('should return available future time slots', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findAvailableFuture({});

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'timeSlot.isAvailable = :isAvailable',
        { isAvailable: true }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'timeSlot.startTime > :now',
        { now: expect.any(Date) }
      );
    });

    it('should apply additional filters to available future time slots', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const filters = {
        psychologistId: 1,
        specializationId: 2,
        appointmentTypeId: 1,
        startDate: new Date('2024-01-15T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
      };
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      const result = await service.findAvailableFuture(filters);

      expect(result).toEqual(mockTimeSlots);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(6); // 6 additional filters (including default isAvailable filter)
    });

    it('should order by start time ascending', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      
      mockTimeSlotRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockTimeSlots);

      await service.findAvailableFuture({});

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('timeSlot.startTime', 'ASC');
    });
  });
});

// Helper functions to create mock objects
function createMockTimeSlot(
  id: number,
  psychologistId: number,
  appointmentTypeId: number,
  isAvailable: boolean = true
): TimeSlot {
  return {
    id,
    startTime: new Date('2024-01-15T09:00:00Z'),
    endTime: new Date('2024-01-15T10:00:00Z'),
    isAvailable,
    notes: 'Test time slot',
    psychologistId,
    appointmentTypeId,
    meetingLink: 'https://meet.google.com/test',
    address: '123 Test St',
    psychologist: null,
    appointmentType: null,
    booking: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as TimeSlot;
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
