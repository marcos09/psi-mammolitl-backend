import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '@/entities/booking.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Psychologist } from '@/entities/psychologist.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
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

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    // Validate that the time slot exists and is available
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id: bookingData.timeSlotId },
      relations: ['psychologist', 'psychologist.specializations'],
    });

    if (!timeSlot) {
      throw new BadRequestException('Time slot not found');
    }

    if (!timeSlot.isAvailable) {
      throw new BadRequestException('Time slot is not available');
    }

    // Check if there's already a booking for this time slot
    const existingBooking = await this.findByTimeSlot(
      bookingData.timeSlotId || 0,
    );
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

    // Create the booking
    const booking = this.bookingRepository.create(bookingData);
    const savedBooking = await this.bookingRepository.save(booking);

    // Mark the time slot as unavailable
    await this.timeSlotRepository.update(bookingData.timeSlotId || 0, {
      isAvailable: false,
    });

    return savedBooking;
  }

  async update(
    id: number,
    bookingData: Partial<Booking>,
  ): Promise<Booking | null> {
    await this.bookingRepository.update(id, bookingData);
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
}
