import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeSlot } from '@/entities/timeslot.entity';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async findAll(): Promise<TimeSlot[]> {
    return this.timeSlotRepository.find();
  }

  async findOne(id: number): Promise<TimeSlot | null> {
    return this.timeSlotRepository.findOne({ where: { id } });
  }

  async findByPsychologist(psychologistId: number): Promise<TimeSlot[]> {
    return this.timeSlotRepository.find({ 
      where: { psychologistId },
      order: { startTime: 'ASC' }
    });
  }

  async findAvailableByPsychologist(psychologistId: number): Promise<TimeSlot[]> {
    return this.timeSlotRepository.find({ 
      where: { 
        psychologistId,
        isAvailable: true 
      },
      order: { startTime: 'ASC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    return this.timeSlotRepository.find({
      where: {
        startTime: Between(startDate, endDate)
      },
      order: { startTime: 'ASC' }
    });
  }

  async findByPsychologistAndDateRange(
    psychologistId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<TimeSlot[]> {
    return this.timeSlotRepository.find({
      where: {
        psychologistId,
        startTime: Between(startDate, endDate)
      },
      order: { startTime: 'ASC' }
    });
  }

  async create(timeSlotData: Partial<TimeSlot>): Promise<TimeSlot> {
    const timeSlot = this.timeSlotRepository.create(timeSlotData);
    return this.timeSlotRepository.save(timeSlot);
  }

  async update(id: number, timeSlotData: Partial<TimeSlot>): Promise<TimeSlot | null> {
    await this.timeSlotRepository.update(id, timeSlotData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.timeSlotRepository.delete(id);
  }

  async markAsUnavailable(id: number): Promise<TimeSlot | null> {
    await this.timeSlotRepository.update(id, { isAvailable: false });
    return this.findOne(id);
  }

  async markAsAvailable(id: number): Promise<TimeSlot | null> {
    await this.timeSlotRepository.update(id, { isAvailable: true });
    return this.findOne(id);
  }

  async findAvailableFutureByPsychologist(psychologistId: number): Promise<TimeSlot[]> {
    const now = new Date();
    return this.timeSlotRepository.find({
      where: {
        psychologistId,
        isAvailable: true,
        startTime: Between(now, new Date('2099-12-31')) // Far future date
      },
      order: { startTime: 'ASC' }
    });
  }

  async findAvailableFutureBySpecialization(specializationId: number): Promise<TimeSlot[]> {
    const now = new Date();
    return this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .leftJoinAndSelect('timeSlot.psychologist', 'psychologist')
      .leftJoinAndSelect('psychologist.specializations', 'specialization')
      .where('timeSlot.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('timeSlot.startTime > :now', { now })
      .andWhere('specialization.id = :specializationId', { specializationId })
      .orderBy('timeSlot.startTime', 'ASC')
      .getMany();
  }
}
