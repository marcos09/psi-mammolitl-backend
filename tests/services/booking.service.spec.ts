import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { BookingService } from '../../src/services/booking.service';
import { Booking } from '@/entities/booking.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType, AppointmentTypeEnum } from '@/entities/appointment-type.entity';
import { Specialization } from '@/entities/specialization.entity';
import { CreateBookingDto } from '@/dto/booking.dto';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Repository<Booking>;
  let timeSlotRepository: Repository<TimeSlot>;
  let psychologistRepository: Repository<Psychologist>;
  let appointmentTypeRepository: Repository<AppointmentType>;

  const mockBookingRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTimeSlotRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockPsychologistRepository = {
    findOne: jest.fn(),
  };

  const mockAppointmentTypeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(TimeSlot),
          useValue: mockTimeSlotRepository,
        },
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

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    timeSlotRepository = module.get<Repository<TimeSlot>>(getRepositoryToken(TimeSlot));
    psychologistRepository = module.get<Repository<Psychologist>>(getRepositoryToken(Psychologist));
    appointmentTypeRepository = module.get<Repository<AppointmentType>>(getRepositoryToken(AppointmentType));
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

      mockBookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findAll();

      expect(result).toEqual(mockBookings);
      expect(mockBookingRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a booking by ID', async () => {
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com');
      
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBooking);
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByTimeSlot', () => {
    it('should return booking by time slot ID', async () => {
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1);
      
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findByTimeSlot(1);

      expect(result).toEqual(mockBooking);
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({ where: { timeSlotId: 1 } });
    });

    it('should return null when no booking found for time slot', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      const result = await service.findByTimeSlot(999);

      expect(result).toBeNull();
    });
  });

  describe('findByClientEmail', () => {
    it('should return bookings by client email', async () => {
      const mockBookings = [
        createMockBooking(1, 'John Doe', 'john@example.com'),
        createMockBooking(2, 'John Doe', 'john@example.com'),
      ];

      mockBookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findByClientEmail('john@example.com');

      expect(result).toEqual(mockBookings);
      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        where: { clientEmail: 'john@example.com' },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no bookings found for email', async () => {
      mockBookingRepository.find.mockResolvedValue([]);

      const result = await service.findByClientEmail('nonexistent@example.com');

      expect(result).toEqual([]);
    });
  });

  describe('findByStatus', () => {
    it('should return bookings by status', async () => {
      const mockBookings = [
        createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending'),
        createMockBooking(2, 'Jane Smith', 'jane@example.com', 2, 'pending'),
      ];

      mockBookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findByStatus('pending');

      expect(result).toEqual(mockBookings);
      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        where: { status: 'pending' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('create', () => {
    const mockTimeSlot = createMockTimeSlot(1, 1, 1, true);
    const mockPsychologist = createMockPsychologist(1, 'psychologist@example.com', 'Dr. John', 'Smith');
    const mockSpecialization = createMockSpecialization(1, 'CBT');
    const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);

    beforeEach(() => {
      mockTimeSlot.psychologist = { ...mockPsychologist, specializations: [mockSpecialization] };
      mockTimeSlot.appointmentType = mockAppointmentType;
    });

    it('should create a booking successfully', async () => {
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
        notes: 'First consultation',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 1);
      
      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);
      mockBookingRepository.findOne.mockResolvedValue(null); // No existing booking
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.create(bookingData);

      expect(result).toEqual(mockBooking);
      expect(mockTimeSlotRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['psychologist', 'psychologist.specializations', 'appointmentType'],
      });
      expect(mockBookingRepository.create).toHaveBeenCalledWith(bookingData);
      expect(mockBookingRepository.save).toHaveBeenCalledWith(mockBooking);
      expect(mockTimeSlotRepository.update).toHaveBeenCalledWith(1, { isAvailable: false });
    });

    it('should throw BadRequestException when time slot not found', async () => {
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 999,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      mockTimeSlotRepository.findOne.mockResolvedValue(null);

      await expect(service.create(bookingData)).rejects.toThrow(
        new BadRequestException('Time slot not found')
      );
    });

    it('should throw BadRequestException when time slot is not available', async () => {
      const unavailableTimeSlot = { ...mockTimeSlot, isAvailable: false };
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      mockTimeSlotRepository.findOne.mockResolvedValue(unavailableTimeSlot);

      await expect(service.create(bookingData)).rejects.toThrow(
        new BadRequestException('Time slot is not available')
      );
    });

    it('should throw BadRequestException when appointment type does not match', async () => {
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 2, // Different appointment type
      };

      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);

      await expect(service.create(bookingData)).rejects.toThrow(
        new BadRequestException('Appointment type ID 2 does not match the time slot\'s appointment type (Online)')
      );
    });

    it('should throw BadRequestException when time slot is already booked', async () => {
      const existingBooking = createMockBooking(1, 'Existing Client', 'existing@example.com', 1);
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 1,
      };

      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);
      mockBookingRepository.findOne.mockResolvedValue(existingBooking);

      await expect(service.create(bookingData)).rejects.toThrow(
        new BadRequestException('Time slot is already booked')
      );
    });

    it('should throw BadRequestException when psychologist does not have specialization', async () => {
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 999, // Non-existent specialization
        appointmentTypeId: 1,
      };

      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.create(bookingData)).rejects.toThrow(
        new BadRequestException('Psychologist does not have the requested specialization')
      );
    });

    it('should throw BadRequestException when client address is required for at-home appointments', async () => {
      const atHomeAppointmentType = createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME);
      const atHomeTimeSlot = { ...mockTimeSlot, appointmentType: atHomeAppointmentType };
      
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 3,
        // Missing clientAddress
      };

      mockTimeSlotRepository.findOne.mockResolvedValue(atHomeTimeSlot);
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.create(bookingData)).rejects.toThrow(
        new BadRequestException('Client address is required for at-home appointments')
      );
    });

    it('should create booking successfully for at-home appointment with address', async () => {
      const atHomeAppointmentType = createMockAppointmentType(3, 'At Home', AppointmentTypeEnum.AT_HOME);
      const atHomeTimeSlot = { ...mockTimeSlot, appointmentType: atHomeAppointmentType };
      
      const bookingData: CreateBookingDto = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        timeSlotId: 1,
        specializationId: 1,
        appointmentTypeId: 3,
        clientAddress: '123 Main St, City, State 12345',
      };

      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending', 1, '123 Main St, City, State 12345');
      
      mockTimeSlotRepository.findOne.mockResolvedValue(atHomeTimeSlot);
      mockBookingRepository.findOne.mockResolvedValue(null);
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.create(bookingData);

      expect(result).toEqual(mockBooking);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updateData = { clientName: 'Updated Name', notes: 'Updated notes' };
      const mockUpdatedBooking = createMockBooking(1, 'Updated Name', 'john@example.com', 1, 'pending', 1, undefined, 'Updated notes');
      
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });
      mockBookingRepository.findOne.mockResolvedValue(mockUpdatedBooking);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should validate appointment type when time slot is changed', async () => {
      const mockTimeSlot = createMockTimeSlot(1, 1, 1, true);
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      mockTimeSlot.appointmentType = mockAppointmentType;

      const updateData = { 
        timeSlotId: 1, 
        appointmentTypeId: 1,
        clientName: 'Updated Name' 
      };
      const mockUpdatedBooking = createMockBooking(1, 'Updated Name', 'john@example.com', 1);
      
      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });
      mockBookingRepository.findOne.mockResolvedValue(mockUpdatedBooking);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockTimeSlotRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['appointmentType'],
      });
    });

    it('should throw BadRequestException when appointment type does not match time slot', async () => {
      const mockTimeSlot = createMockTimeSlot(1, 1, 1, true);
      const mockAppointmentType = createMockAppointmentType(1, 'Online', AppointmentTypeEnum.ONLINE);
      mockTimeSlot.appointmentType = mockAppointmentType;

      const updateData = { 
        timeSlotId: 1, 
        appointmentTypeId: 2, // Different appointment type
        clientName: 'Updated Name' 
      };
      
      mockTimeSlotRepository.findOne.mockResolvedValue(mockTimeSlot);

      await expect(service.update(1, updateData)).rejects.toThrow(
        new BadRequestException('Appointment type ID 2 does not match the time slot\'s appointment type (Online)')
      );
    });

    it('should return null when updating non-existent booking', async () => {
      const updateData = { clientName: 'Updated Name' };
      
      mockBookingRepository.update.mockResolvedValue({ affected: 0 });
      mockBookingRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateData);

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      const mockUpdatedBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'confirmed');
      
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });
      mockBookingRepository.findOne.mockResolvedValue(mockUpdatedBooking);

      const result = await service.updateStatus(1, 'confirmed');

      expect(result).toEqual(mockUpdatedBooking);
      expect(mockBookingRepository.update).toHaveBeenCalledWith(1, { status: 'confirmed' });
    });

    it('should return null when updating status of non-existent booking', async () => {
      mockBookingRepository.update.mockResolvedValue({ affected: 0 });
      mockBookingRepository.findOne.mockResolvedValue(null);

      const result = await service.updateStatus(999, 'confirmed');

      expect(result).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should cancel a booking and make time slot available', async () => {
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1, 'pending');
      const mockCancelledBooking = { ...mockBooking, status: 'cancelled' };
      
      mockBookingRepository.findOne
        .mockResolvedValueOnce(mockBooking) // First call for finding booking
        .mockResolvedValueOnce(mockCancelledBooking); // Second call for returning updated booking
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.cancel(1);

      expect(result).toEqual(mockCancelledBooking);
      expect(mockBookingRepository.update).toHaveBeenCalledWith(1, { status: 'cancelled' });
      expect(mockTimeSlotRepository.update).toHaveBeenCalledWith(1, { isAvailable: true });
    });

    it('should throw BadRequestException when booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(
        new BadRequestException('Booking not found')
      );
    });
  });

  describe('remove', () => {
    it('should delete a booking and make time slot available', async () => {
      const mockBooking = createMockBooking(1, 'John Doe', 'john@example.com', 1);
      
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockTimeSlotRepository.update.mockResolvedValue({ affected: 1 });
      mockBookingRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockTimeSlotRepository.update).toHaveBeenCalledWith(1, { isAvailable: true });
      expect(mockBookingRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete booking even when booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);
      mockBookingRepository.delete.mockResolvedValue({ affected: 0 });

      await service.remove(999);

      expect(mockTimeSlotRepository.update).not.toHaveBeenCalled();
      expect(mockBookingRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});

// Helper functions to create mock objects
function createMockBooking(
  id: number,
  clientName: string,
  clientEmail: string,
  timeSlotId: number = 1,
  status: string = 'pending',
  specializationId: number = 1,
  clientAddress?: string,
  notes?: string
): Booking {
  return {
    id,
    clientName,
    clientEmail,
    clientPhone: '+1234567890',
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

function createMockTimeSlot(
  id: number,
  psychologistId: number,
  appointmentTypeId: number,
  isAvailable: boolean = true
): TimeSlot {
  return {
    id,
    startTime: new Date(),
    endTime: new Date(),
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

function createMockSpecialization(
  id: number,
  name: string,
  description?: string
): Specialization {
  return {
    id,
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Specialization;
}
