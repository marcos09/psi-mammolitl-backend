import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '@/entities/booking.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import {
  AppointmentType,
  AppointmentTypeEnum,
} from '@/entities/appointment-type.entity';
import { CreateBookingDto } from '@/dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
    @InjectRepository(AppointmentType)
    private appointmentTypeRepository: Repository<AppointmentType>,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<Booking | null> {
    return this.bookingRepository.findOne({ where: { id } });
  }

  async findByTimeSlot(timeSlotId: number): Promise<Booking | null> {
    return this.bookingRepository.findOne({ where: { timeSlotId } });
  }

  async findByClientEmail(clientEmail: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { clientEmail },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(bookingData: CreateBookingDto): Promise<Booking> {
    // Validate that the time slot exists and is available
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id: bookingData.timeSlotId },
      relations: [
        'psychologist',
        'psychologist.specializations',
        'appointmentType',
      ],
    });

    if (!timeSlot) {
      throw new BadRequestException('Time slot not found');
    }

    if (!timeSlot.isAvailable) {
      throw new BadRequestException('Time slot is not available');
    }

    // Validate that the appointment type matches the time slot's appointment type
    if (timeSlot.appointmentType.id !== bookingData.appointmentTypeId) {
      throw new BadRequestException(
        `Appointment type ID ${bookingData.appointmentTypeId} does not match the time slot's appointment type (${timeSlot.appointmentType.name})`,
      );
    }

    // Check if there's already a booking for this time slot
    const existingBooking = await this.findByTimeSlot(bookingData.timeSlotId);
    if (existingBooking) {
      throw new BadRequestException('Time slot is already booked');
    }

    // Validate that the psychologist has the requested specialization
    const psychologist = timeSlot.psychologist;
    const hasSpecialization = psychologist.specializations.some(
      (spec) => spec.id === bookingData.specializationId,
    );

    if (!hasSpecialization) {
      throw new BadRequestException(
        'Psychologist does not have the requested specialization',
      );
    }

    // Validate appointment type specific requirements
    await this.validateAppointmentTypeRequirements(
      timeSlot.appointmentType,
      bookingData,
    );

    // Create the booking
    const booking = this.bookingRepository.create(bookingData);
    const savedBooking = await this.bookingRepository.save(booking);

    // Mark the time slot as unavailable
    await this.timeSlotRepository.update(bookingData.timeSlotId, {
      isAvailable: false,
    });

    return savedBooking;
  }

  async update(
    id: number,
    bookingData: Partial<Booking> & { appointmentTypeId?: number },
  ): Promise<Booking | null> {
    // If appointment type or time slot is being changed, validate requirements
    if (bookingData.timeSlotId || bookingData.appointmentTypeId) {
      const timeSlot = await this.timeSlotRepository.findOne({
        where: { id: bookingData.timeSlotId },
        relations: ['appointmentType'],
      });

      if (timeSlot) {
        // If appointmentTypeId is provided, validate it matches the time slot
        if (bookingData.appointmentTypeId && timeSlot.appointmentType.id !== bookingData.appointmentTypeId) {
          throw new BadRequestException(
            `Appointment type ID ${bookingData.appointmentTypeId} does not match the time slot's appointment type (${timeSlot.appointmentType.name})`,
          );
        }

        await this.validateAppointmentTypeRequirements(
          timeSlot.appointmentType,
          bookingData as CreateBookingDto,
        );
      }
    }

    // Remove appointmentTypeId from bookingData before saving since it's not part of the Booking entity
    const { appointmentTypeId, ...bookingEntityData } = bookingData;
    await this.bookingRepository.update(id, bookingEntityData);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: string): Promise<Booking | null> {
    await this.bookingRepository.update(id, { status });
    return this.findOne(id);
  }

  async cancel(id: number): Promise<Booking | null> {
    const booking = await this.findOne(id);
    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    // Update booking status
    await this.bookingRepository.update(id, { status: 'cancelled' });

    // Mark the time slot as available again
    await this.timeSlotRepository.update(booking.timeSlotId, {
      isAvailable: true,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    if (booking) {
      // Mark the time slot as available again
      await this.timeSlotRepository.update(booking.timeSlotId, {
        isAvailable: true,
      });
    }
    await this.bookingRepository.delete(id);
  }

  private validateAppointmentTypeRequirements(
    appointmentType: AppointmentType,
    bookingData: CreateBookingDto,
  ): void {
    if (!appointmentType) {
      throw new BadRequestException('Appointment type not found');
    }

    // Validate required fields based on appointment type
    switch (appointmentType.code) {
      case AppointmentTypeEnum.AT_HOME:
        if (!bookingData.clientAddress || bookingData.clientAddress.trim() === '') {
          throw new BadRequestException(
            'Client address is required for at-home appointments',
          );
        }
        break;
      case AppointmentTypeEnum.ONLINE:
      case AppointmentTypeEnum.ON_SITE:
        // These don't require client address
        // If address is provided for non-at-home appointments, it's optional but allowed
        break;
    }
  }
}
