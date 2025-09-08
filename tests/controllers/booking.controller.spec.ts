import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from '../../src/controllers/booking.controller';
import { BookingService } from '@/services/booking.service';
import { Booking } from '@/entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto, UpdateBookingStatusDto } from '@/dto/booking.dto';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  const mockBookingService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByTimeSlot: jest.fn(),
    findByClientEmail: jest.fn(),
    findByStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    cancel: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const mockBookings = [
        createMockBooking(1, 'John Doe', 'john@example.com'),
        createMockBooking(2, 'Jane Smith', 'jane@example.com'),
      ];

      mockBookingService.findAll.mockResolvedValue(mockBookings);

      const result = await controller.findAll();

      expect(result).toEqual(mockBookings);
      expect(mockBookingService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no bookings exist', async () => {
      mockBookingService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a booking by ID', async () => {
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com');

      mockBookingService.findOne.mockResolvedValue(mockBooking);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockBooking);
      expect(mockBookingService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when booking not found', async () => {
      mockBookingService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(mockBookingService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('findByTimeSlot', () => {
    it('should return booking by time slot ID', async () => {
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1);

      mockBookingService.findByTimeSlot.mockResolvedValue(mockBooking);

      const result = await controller.findByTimeSlot(1);

      expect(result).toEqual(mockBooking);
      expect(mockBookingService.findByTimeSlot).toHaveBeenCalledWith(1);
    });

    it('should return null when no booking found for time slot', async () => {
      mockBookingService.findByTimeSlot.mockResolvedValue(null);

      const result = await controller.findByTimeSlot(999);

      expect(result).toBeNull();
      expect(mockBookingService.findByTimeSlot).toHaveBeenCalledWith(999);
    });
  });

  describe('findByClientEmail', () => {
    it('should return bookings by client email', async () => {
      const mockBookings = [
        createMockBooking(1, 'John Doe', 'john@example.com'),
        createMockBooking(2, 'John Doe', 'john@example.com'),
      ];

      mockBookingService.findByClientEmail.mockResolvedValue(mockBookings);

      const result = await controller.findByClientEmail('john@example.com');

      expect(result).toEqual(mockBookings);
      expect(mockBookingService.findByClientEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should return empty array when no bookings found for email', async () => {
      mockBookingService.findByClientEmail.mockResolvedValue([]);

      const result = await controller.findByClientEmail('nonexistent@example.com');

      expect(result).toEqual([]);
      expect(mockBookingService.findByClientEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should handle email with special characters', async () => {
      const mockBookings = [createMockBooking(1, 'John Doe', 'john+test@example.com')];

      mockBookingService.findByClientEmail.mockResolvedValue(mockBookings);

      const result = await controller.findByClientEmail('john+test@example.com');

      expect(result).toEqual(mockBookings);
      expect(mockBookingService.findByClientEmail).toHaveBeenCalledWith('john+test@example.com');
    });
  });

  describe('findByStatus', () => {
    it('should return bookings by status', async () => {
      const mockBookings = [
        createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending'),
        createMockBooking(2, 'Jane Smith', 'jane@example.com', 2, 'pending'),
      ];

      mockBookingService.findByStatus.mockResolvedValue(mockBookings);

      const result = await controller.findByStatus('pending');

      expect(result).toEqual(mockBookings);
      expect(mockBookingService.findByStatus).toHaveBeenCalledWith('pending');
    });

    it('should return empty array when no bookings found for status', async () => {
      mockBookingService.findByStatus.mockResolvedValue([]);

      const result = await controller.findByStatus('completed');

      expect(result).toEqual([]);
      expect(mockBookingService.findByStatus).toHaveBeenCalledWith('completed');
    });

    it('should handle different status values', async () => {
      const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      
      for (const status of statuses) {
        const mockBookings = [createMockBooking(1, 'John Doe', 'john@example.com', 1, status)];
        mockBookingService.findByStatus.mockResolvedValue(mockBookings);

        const result = await controller.findByStatus(status);

        expect(result).toEqual(mockBookings);
        expect(mockBookingService.findByStatus).toHaveBeenCalledWith(status);
      }
    });
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const createDto: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
        notes: 'First consultation',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      const mockCreatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 1);

      mockBookingService.create.mockResolvedValue(mockCreatedBooking);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedBooking);
      expect(mockBookingService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create booking with minimal data', async () => {
      const createDto: CreateBookingDto = {
        clientName: 'Jane Doe',
        clientEmail: 'jane@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      const mockCreatedBooking = createMockBooking(1, 'Jane Doe', 'jane@example.com', 1, 'pending', 1);

      mockBookingService.create.mockResolvedValue(mockCreatedBooking);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedBooking);
      expect(mockBookingService.create).toHaveBeenCalledWith(createDto);
    });

    it('should create booking for at-home appointment with address', async () => {
      const createDto: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 3, // At-home
        clientAddress: '123 Main St, City, State 12345',
      };

      const mockCreatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 1, '123 Main St, City, State 12345');

      mockBookingService.create.mockResolvedValue(mockCreatedBooking);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreatedBooking);
      expect(mockBookingService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateDto: UpdateBookingDto = {
        clientName: 'Updated Name',
        notes: 'Updated notes',
      };

      const mockUpdatedBooking = createMockBooking(1, 'Updated Name', 'john@example.com', 1, 'pending', 1, undefined, 'Updated notes');

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update client email', async () => {
      const updateDto: UpdateBookingDto = {
        clientEmail: 'newemail@example.com',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'newemail@example.com');

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update client phone', async () => {
      const updateDto: UpdateBookingDto = {
        clientPhone: '+9876543210',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 1, undefined, undefined, '+9876543210');

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update time slot', async () => {
      const updateDto: UpdateBookingDto = {
        timeSlotId: 2,
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 2);

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update specialization', async () => {
      const updateDto: UpdateBookingDto = {
        specializationId: 2,
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 2);

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update appointment type', async () => {
      const updateDto: UpdateBookingDto = {
        appointmentTypeId: 2,
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com');

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update client address', async () => {
      const updateDto: UpdateBookingDto = {
        clientAddress: '456 New St, New City, State 54321',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 1, '456 New St, New City, State 54321');

      mockBookingService.update.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should return null when updating non-existent booking', async () => {
      const updateDto: UpdateBookingDto = {
        clientName: 'Updated Name',
      };

      mockBookingService.update.mockResolvedValue(null);

      const result = await controller.update(999, updateDto);

      expect(result).toBeNull();
      expect(mockBookingService.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('should handle empty update data', async () => {
      const updateDto: UpdateBookingDto = {};
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com');

      mockBookingService.update.mockResolvedValue(mockBooking);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockBooking);
      expect(mockBookingService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      const updateStatusDto: UpdateBookingStatusDto = {
        status: 'confirmed',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'confirmed');

      mockBookingService.updateStatus.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.updateStatus(1, updateStatusDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.updateStatus).toHaveBeenCalledWith(1, 'confirmed');
    });

    it('should update status to pending', async () => {
      const updateStatusDto: UpdateBookingStatusDto = {
        status: 'pending',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending');

      mockBookingService.updateStatus.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.updateStatus(1, updateStatusDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.updateStatus).toHaveBeenCalledWith(1, 'pending');
    });

    it('should update status to cancelled', async () => {
      const updateStatusDto: UpdateBookingStatusDto = {
        status: 'cancelled',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'cancelled');

      mockBookingService.updateStatus.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.updateStatus(1, updateStatusDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.updateStatus).toHaveBeenCalledWith(1, 'cancelled');
    });

    it('should update status to completed', async () => {
      const updateStatusDto: UpdateBookingStatusDto = {
        status: 'completed',
      };

      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'completed');

      mockBookingService.updateStatus.mockResolvedValue(mockUpdatedBooking);

      const result = await controller.updateStatus(1, updateStatusDto);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingService.updateStatus).toHaveBeenCalledWith(1, 'completed');
    });

    it('should return null when updating status of non-existent booking', async () => {
      const updateStatusDto: UpdateBookingStatusDto = {
        status: 'confirmed',
      };

      mockBookingService.updateStatus.mockResolvedValue(null);

      const result = await controller.updateStatus(999, updateStatusDto);

      expect(result).toBeNull();
      expect(mockBookingService.updateStatus).toHaveBeenCalledWith(999, 'confirmed');
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const mockCancelledBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'cancelled');

      mockBookingService.cancel.mockResolvedValue(mockCancelledBooking);

      const result = await controller.cancel(1);

      expect(result).toEqual(mockCancelledBooking);
      expect(mockBookingService.cancel).toHaveBeenCalledWith(1);
    });

    it('should return null when cancelling non-existent booking', async () => {
      mockBookingService.cancel.mockResolvedValue(null);

      const result = await controller.cancel(999);

      expect(result).toBeNull();
      expect(mockBookingService.cancel).toHaveBeenCalledWith(999);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      mockBookingService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toEqual({ message: 'Booking deleted successfully' });
      expect(mockBookingService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of non-existent booking', async () => {
      mockBookingService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(999);

      expect(result).toEqual({ message: 'Booking deleted successfully' });
      expect(mockBookingService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors in findAll', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findOne', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findByTimeSlot', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.findByTimeSlot.mockRejectedValue(error);

      await expect(controller.findByTimeSlot(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findByClientEmail', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.findByClientEmail.mockRejectedValue(error);

      await expect(controller.findByClientEmail('test@example.com')).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in findByStatus', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.findByStatus.mockRejectedValue(error);

      await expect(controller.findByStatus('pending')).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in create', async () => {
      const error = new Error('Database connection failed');
      const createDto: CreateBookingDto = {
        clientName: 'Test',
        clientEmail: 'test@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      mockBookingService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in update', async () => {
      const error = new Error('Database connection failed');
      const updateDto: UpdateBookingDto = { clientName: 'Updated' };

      mockBookingService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in updateStatus', async () => {
      const error = new Error('Database connection failed');
      const updateStatusDto: UpdateBookingStatusDto = { status: 'confirmed' };

      mockBookingService.updateStatus.mockRejectedValue(error);

      await expect(controller.updateStatus(1, updateStatusDto)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in cancel', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.cancel.mockRejectedValue(error);

      await expect(controller.cancel(1)).rejects.toThrow('Database connection failed');
    });

    it('should propagate service errors in remove', async () => {
      const error = new Error('Database connection failed');
      mockBookingService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Database connection failed');
    });
  });
});

// Helper function to create mock booking
function createMockBooking(
  id: number,
  clientName: string,
  clientEmail: string,
  timeSlotId: number = 1,
  status: string = 'pending',
  specializationId: number = 1,
  clientAddress?: string,
  notes?: string,
  clientPhone?: string
): Booking {
  return {
    id,
    clientName,
    clientEmail,
    clientPhone: clientPhone || '+1234567890',
    notes,
    status,
    clientAddress,
    timeSlotId,
    specializationId,
    timeSlot: null,
    specialization: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Booking;
}
