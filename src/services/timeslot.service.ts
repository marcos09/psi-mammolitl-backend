import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeSlot } from '@/entities/timeslot.entity';
import {
  AppointmentType,
  AppointmentTypeEnum,
} from '@/entities/appointment-type.entity';
import { CreateTimeSlotDto } from '@/dto/timeslot.dto';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(AppointmentType)
    private appointmentTypeRepository: Repository<AppointmentType>,
  ) {}

  async findAll(): Promise<TimeSlot[]> {
    return this.timeSlotRepository.find();
  }

  async findOne(id: number): Promise<TimeSlot | null> {
    return this.timeSlotRepository.findOne({ where: { id } });
  }

  async create(timeSlotData: CreateTimeSlotDto): Promise<TimeSlot> {
    // Validate appointment type and required fields
    await this.validateAppointmentTypeData(timeSlotData);

    const timeSlot = this.timeSlotRepository.create(timeSlotData);
    return this.timeSlotRepository.save(timeSlot);
  }

  async update(
    id: number,
    timeSlotData: Partial<TimeSlot>,
  ): Promise<TimeSlot | null> {
    // If appointment type is being updated, validate the new data
    if (timeSlotData.appointmentTypeId) {
      await this.validateAppointmentTypeData(timeSlotData as CreateTimeSlotDto);
    }

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


  async findWithFilters(filters: {
    psychologistId?: number;
    specializationId?: number;
    appointmentTypeId?: number;
    isAvailable?: boolean;
    futureOnly?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeSlot[]> {
    const queryBuilder = this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .leftJoinAndSelect('timeSlot.psychologist', 'psychologist')
      .leftJoinAndSelect('timeSlot.appointmentType', 'appointmentType');

    // Add specialization join if filtering by specialization
    if (filters.specializationId) {
      queryBuilder.leftJoinAndSelect('psychologist.specializations', 'specialization');
    }

    // Apply filters
    if (filters.psychologistId) {
      queryBuilder.andWhere('timeSlot.psychologistId = :psychologistId', { 
        psychologistId: filters.psychologistId 
      });
    }

    if (filters.specializationId) {
      queryBuilder.andWhere('specialization.id = :specializationId', { 
        specializationId: filters.specializationId 
      });
    }

    if (filters.appointmentTypeId) {
      queryBuilder.andWhere('timeSlot.appointmentTypeId = :appointmentTypeId', { 
        appointmentTypeId: filters.appointmentTypeId 
      });
    }

    // Default to showing only available timeslots unless explicitly set to false
    if (filters.isAvailable === undefined) {
      queryBuilder.andWhere('timeSlot.isAvailable = :isAvailable', { 
        isAvailable: true 
      });
    } else if (filters.isAvailable !== undefined) {
      queryBuilder.andWhere('timeSlot.isAvailable = :isAvailable', { 
        isAvailable: filters.isAvailable 
      });
    }

    if (filters.futureOnly) {
      const now = new Date();
      queryBuilder.andWhere('timeSlot.startTime > :now', { now });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('timeSlot.startTime >= :startDate', { 
        startDate: filters.startDate 
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('timeSlot.startTime <= :endDate', { 
        endDate: filters.endDate 
      });
    }

    return queryBuilder
      .orderBy('timeSlot.startTime', 'ASC')
      .getMany();
  }

  async findAvailableFuture(filters: {
    psychologistId?: number;
    specializationId?: number;
    appointmentTypeId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeSlot[]> {
    const now = new Date();
    const queryBuilder = this.timeSlotRepository
      .createQueryBuilder('timeSlot')
      .leftJoinAndSelect('timeSlot.psychologist', 'psychologist')
      .leftJoinAndSelect('timeSlot.appointmentType', 'appointmentType')
      .where('timeSlot.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('timeSlot.startTime > :now', { now });

    // Add specialization join if filtering by specialization
    if (filters.specializationId) {
      queryBuilder.leftJoinAndSelect('psychologist.specializations', 'specialization');
    }

    // Apply filters
    if (filters.psychologistId) {
      queryBuilder.andWhere('timeSlot.psychologistId = :psychologistId', { 
        psychologistId: filters.psychologistId 
      });
    }

    if (filters.specializationId) {
      queryBuilder.andWhere('specialization.id = :specializationId', { 
        specializationId: filters.specializationId 
      });
    }

    if (filters.appointmentTypeId) {
      queryBuilder.andWhere('timeSlot.appointmentTypeId = :appointmentTypeId', { 
        appointmentTypeId: filters.appointmentTypeId 
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('timeSlot.startTime >= :startDate', { 
        startDate: filters.startDate 
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('timeSlot.startTime <= :endDate', { 
        endDate: filters.endDate 
      });
    }

    return queryBuilder
      .orderBy('timeSlot.startTime', 'ASC')
      .getMany();
  }

  private async validateAppointmentTypeData(
    timeSlotData: CreateTimeSlotDto,
  ): Promise<void> {
    if (!timeSlotData.appointmentTypeId) {
      throw new BadRequestException('Appointment type is required');
    }

    const appointmentType = await this.appointmentTypeRepository.findOne({
      where: { id: timeSlotData.appointmentTypeId, isActive: true },
    });

    if (!appointmentType) {
      throw new NotFoundException(
        `Appointment type with ID ${timeSlotData.appointmentTypeId} not found`,
      );
    }

    // Validate required fields based on appointment type
    switch (appointmentType.code) {
      case AppointmentTypeEnum.ONLINE:
        if (!timeSlotData.meetingLink) {
          throw new BadRequestException(
            'Meeting link is required for online appointments',
          );
        }
        break;
      case AppointmentTypeEnum.ON_SITE:
      case AppointmentTypeEnum.AT_HOME:
        if (!timeSlotData.address) {
          throw new BadRequestException(
            'Address is required for on-site and at-home appointments',
          );
        }
        break;
    }
  }
}
