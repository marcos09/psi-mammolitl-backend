import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotController } from '../../src/controllers/timeslot.controller';
import { TimeSlotService } from '@/services/timeslot.service';
import { TimeSlot } from '@/entities/timeslot.entity';
import { CreateTimeSlotDto, UpdateTimeSlotDto, TimeSlotQueryDto, TimeSlotAvailableFutureQueryDto } from '@/dto/timeslot.dto';

describe('TimeSlotController', () => {
  let controller: TimeSlotController;
  let service: TimeSlotService;

  const mockTimeSlotService = {
    findWithFilters: jest.fn(),
    findAvailableFuture: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    markAsUnavailable: jest.fn(),
    markAsAvailable: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSlotController],
      providers: [
        {
          provide: TimeSlotService,
          useValue: mockTimeSlotService,
        },
      ],
    }).compile();

    controller = module.get<TimeSlotController>(TimeSlotController);
    service = module.get<TimeSlotService>(TimeSlotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return time slots with default filters', async () => {
      const mockTimeSlots = [
        createMockTimeSlot(1, 1, 1, true),
        createMockTimeSlot(2, 1, 2, true),
      ];

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll({});

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith({});
    });

    it('should filter by psychologist ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotQueryDto = { psychologistId: 1 };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should filter by specialization ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotQueryDto = { specializationId: 2 };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should filter by appointment type ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotQueryDto = { appointmentTypeId: 1 };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should filter by availability status', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, false)];
      const query: TimeSlotQueryDto = { isAvailable: false };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should filter by future only', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotQueryDto = { futureOnly: true };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should filter by date range', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-31T23:59:59Z');
      const query: TimeSlotQueryDto = { startDate, endDate };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should apply multiple filters', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotQueryDto = {
        psychologistId: 1,
        specializationId: 2,
        appointmentTypeId: 1,
        isAvailable: true,
        futureOnly: true,
        startDate: new Date('2024-01-15T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
      };

      mockTimeSlotService.findWithFilters.mockResolvedValue(mockTimeSlots);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findWithFilters).toHaveBeenCalledWith(query);
    });

    it('should return empty array when no time slots found', async () => {
      mockTimeSlotService.findWithFilters.mockResolvedValue([]);

      const result = await controller.findAll({});

      expect(result).toEqual([]);
    });
  });

  describe('findBookable', () => {
    it('should return bookable time slots', async () => {
      const mockTimeSlots = [
        createMockTimeSlot(1, 1, 1, true),
        createMockTimeSlot(2, 1, 2, true),
      ];

      mockTimeSlotService.findAvailableFuture.mockResolvedValue(mockTimeSlots);

      const result = await controller.findBookable({});

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findAvailableFuture).toHaveBeenCalledWith({});
    });

    it('should filter bookable time slots by psychologist ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotAvailableFutureQueryDto = { psychologistId: 1 };

      mockTimeSlotService.findAvailableFuture.mockResolvedValue(mockTimeSlots);

      const result = await controller.findBookable(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findAvailableFuture).toHaveBeenCalledWith(query);
    });

    it('should filter bookable time slots by specialization ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotAvailableFutureQueryDto = { specializationId: 2 };

      mockTimeSlotService.findAvailableFuture.mockResolvedValue(mockTimeSlots);

      const result = await controller.findBookable(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findAvailableFuture).toHaveBeenCalledWith(query);
    });

    it('should filter bookable time slots by appointment type ID', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotAvailableFutureQueryDto = { appointmentTypeId: 1 };

      mockTimeSlotService.findAvailableFuture.mockResolvedValue(mockTimeSlots);

      const result = await controller.findBookable(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findAvailableFuture).toHaveBeenCalledWith(query);
    });

    it('should filter bookable time slots by date range', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-31T23:59:59Z');
      const query: TimeSlotAvailableFutureQueryDto = { startDate, endDate };

      mockTimeSlotService.findAvailableFuture.mockResolvedValue(mockTimeSlots);

      const result = await controller.findBookable(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findAvailableFuture).toHaveBeenCalledWith(query);
    });

    it('should apply multiple filters to bookable time slots', async () => {
      const mockTimeSlots = [createMockTimeSlot(1, 1, 1, true)];
      const query: TimeSlotAvailableFutureQueryDto = {
        psychologistId: 1,
        specializationId: 2,
        appointmentTypeId: 1,
        startDate: new Date('2024-01-15T00:00:00Z'),
        endDate: new Date('2024-01-31T23:59:59Z'),
      };

      mockTimeSlotService.findAvailableFuture.mockResolvedValue(mockTimeSlots);

      const result = await controller.findBookable(query);

      expect(result).toEqual(mockTimeSlots);
      expect(mockTimeSlotService.findAvailableFuture).toHaveBeenCalledWith(query);
    });

    it('should return empty array when no bookable time slots found', async () => {
      mockTimeSlotService.findAvailableFuture.mockResolvedValue([]);

      const result = await controller.findBookable({});

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a time slot by ID', async () => {
      const mockTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.findOne.mockResolvedValue(mockTimeSlot);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockTimeSlot);
      expect(mockTimeSlotService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when time slot not found', async () => {
      mockTimeSlotService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockTimeSlotService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new time slot for online appointment', async () => {
      const createDto: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        isAvailable: true,
        notes: 'Morning consultation',
        psychologistId: 1,
        appointmentTypeId: 1,
        meetingLink: 'https://meet.google.com/test',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.create.mockResolvedValue(mockCreatedTimeSlot);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedTimeSlot);
      expect(mockTimeSlotService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create a time slot for on-site appointment', async () => {
      const createDto: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 2,
        address: '123 Main St, City, State 12345',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 2, true);

      mockTimeSlotService.create.mockResolvedValue(mockCreatedTimeSlot);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedTimeSlot);
      expect(mockTimeSlotService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create a time slot for at-home appointment', async () => {
      const createDto: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 3,
        address: '456 Client St, Client City, State 54321',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 3, true);

      mockTimeSlotService.create.mockResolvedValue(mockCreatedTimeSlot);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedTimeSlot);
      expect(mockTimeSlotService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create time slot with minimal data', async () => {
      const createDto: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 1,
        meetingLink: 'https://meet.google.com/test',
      };

      const mockCreatedTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.create.mockResolvedValue(mockCreatedTimeSlot);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedTimeSlot);
      expect(mockTimeSlotService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a time slot', async () => {
      const updateDto: UpdateTimeSlotDto = {
        notes: 'Updated notes',
        isAvailable: false,
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, false);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update start and end times', async () => {
      const updateDto: UpdateTimeSlotDto = {
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update availability status', async () => {
      const updateDto: UpdateTimeSlotDto = {
        isAvailable: false,
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, false);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update psychologist ID', async () => {
      const updateDto: UpdateTimeSlotDto = {
        psychologistId: 2,
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 2, 1, true);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update appointment type ID', async () => {
      const updateDto: UpdateTimeSlotDto = {
        appointmentTypeId: 2,
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 2, true);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update meeting link', async () => {
      const updateDto: UpdateTimeSlotDto = {
        meetingLink: 'https://meet.google.com/new-link',
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update address', async () => {
      const updateDto: UpdateTimeSlotDto = {
        address: '456 New St, New City, State 54321',
      };

      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.update.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should return null when updating non-existent time slot', async () => {
      const updateDto: UpdateTimeSlotDto = {
        notes: 'Updated notes',
      };

      mockTimeSlotService.update.mockResolvedValue(null);

      const result = await controller.update(999, updateDto);

      expect(result).toBeNull();
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('should handle empty update data', async () => {
      const updateDto: UpdateTimeSlotDto = {};
      const mockTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.update.mockResolvedValue(mockTimeSlot);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockTimeSlot);
      expect(mockTimeSlotService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('markAsUnavailable', () => {
    it('should mark time slot as unavailable', async () => {
      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, false);

      mockTimeSlotService.markAsUnavailable.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.markAsUnavailable(1);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.markAsUnavailable).toHaveBeenCalledWith(1);
    });

    it('should return null when marking non-existent time slot as unavailable', async () => {
      mockTimeSlotService.markAsUnavailable.mockResolvedValue(null);

      const result = await controller.markAsUnavailable(999);

      expect(result).toBeNull();
      expect(mockTimeSlotService.markAsUnavailable).toHaveBeenCalledWith(999);
    });
  });

  describe('markAsAvailable', () => {
    it('should mark time slot as available', async () => {
      const mockUpdatedTimeSlot = createMockTimeSlot(1, 1, 1, true);

      mockTimeSlotService.markAsAvailable.mockResolvedValue(mockUpdatedTimeSlot);

      const result = await controller.markAsAvailable(1);

      expect(result).toEqual(mockUpdatedTimeSlot);
      expect(mockTimeSlotService.markAsAvailable).toHaveBeenCalledWith(1);
    });

    it('should return null when marking non-existent time slot as available', async () => {
      mockTimeSlotService.markAsAvailable.mockResolvedValue(null);

      const result = await controller.markAsAvailable(999);

      expect(result).toBeNull();
      expect(mockTimeSlotService.markAsAvailable).toHaveBeenCalledWith(999);
    });
  });

  describe('remove', () => {
    it('should delete a time slot', async () => {
      mockTimeSlotService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({ message: 'Time slot deleted successfully' });
      expect(mockTimeSlotService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of non-existent time slot', async () => {
      mockTimeSlotService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(999);

      expect(result).toEqual({ message: 'Time slot deleted successfully' });
      expect(mockTimeSlotService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors in findAll', async () => {
      const error = new Error('Database connection failed');
      mockTimeSlotService.findWithFilters.mockRejectedValue(error);

      await expect(controller.findAll({})).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findBookable', async () => {
      const error = new Error('Database connection failed');
      mockTimeSlotService.findAvailableFuture.mockRejectedValue(error);

      await expect(controller.findBookable({})).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findOne', async () => {
      const error = new Error('Database connection failed');
      mockTimeSlotService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in create', async () => {
      const error = new Error('Database connection failed');
      const createDto: CreateTimeSlotDto = {
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T10:00:00Z'),
        psychologistId: 1,
        appointmentTypeId: 1,
        meetingLink: 'https://meet.google.com/test',
      };

      mockTimeSlotService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in update', async () => {
      const error = new Error('Database connection failed');
      const updateDto: UpdateTimeSlotDto = { notes: 'Updated' };

      mockTimeSlotService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in markAsUnavailable', async () => {
      const error = new Error('Database connection failed');
      mockTimeSlotService.markAsUnavailable.mockRejectedValue(error);

      await expect(controller.markAsUnavailable(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in markAsAvailable', async () => {
      const error = new Error('Database connection failed');
      mockTimeSlotService.markAsAvailable.mockRejectedValue(error);

      await expect(controller.markAsAvailable(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in remove', async () => {
      const error = new Error('Database connection failed');
      mockTimeSlotService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Database connection failed');
    });
  });
});

// Helper function to create mock time slot
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
