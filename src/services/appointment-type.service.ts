import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AppointmentType,
  AppointmentTypeEnum,
} from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import {
  CreateAppointmentTypeDto,
  UpdateAppointmentTypeDto,
} from '@/dto/appointment-type.dto';

@Injectable()
export class AppointmentTypeService {
  constructor(
    @InjectRepository(AppointmentType)
    private appointmentTypeRepository: Repository<AppointmentType>,
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
  ) {}

  async create(
    createAppointmentTypeDto: CreateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    const appointmentType = this.appointmentTypeRepository.create(
      createAppointmentTypeDto,
    );
    return this.appointmentTypeRepository.save(appointmentType);
  }

  async findAll(): Promise<AppointmentType[]> {
    return this.appointmentTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<AppointmentType> {
    const appointmentType = await this.appointmentTypeRepository.findOne({
      where: { id, isActive: true },
    });

    if (!appointmentType) {
      throw new NotFoundException(`Appointment type with ID ${id} not found`);
    }

    return appointmentType;
  }

  async findByCode(code: string): Promise<AppointmentType | null> {
    return this.appointmentTypeRepository.findOne({
      where: { code: code as AppointmentTypeEnum, isActive: true },
    });
  }

  async update(
    id: number,
    updateAppointmentTypeDto: UpdateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    const appointmentType = await this.findOne(id);

    Object.assign(appointmentType, updateAppointmentTypeDto);
    return this.appointmentTypeRepository.save(appointmentType);
  }

  async remove(id: number): Promise<void> {
    const appointmentType = await this.findOne(id);

    // Soft delete by setting isActive to false
    appointmentType.isActive = false;
    await this.appointmentTypeRepository.save(appointmentType);
  }

  async findAllIncludingInactive(): Promise<AppointmentType[]> {
    return this.appointmentTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  // New method to get psychologists offering a specific appointment type
  async getPsychologistsByAppointmentType(
    appointmentTypeId: number,
  ): Promise<Psychologist[]> {
    return this.psychologistRepository
      .createQueryBuilder('psychologist')
      .leftJoinAndSelect('psychologist.appointmentTypes', 'appointmentType')
      .leftJoinAndSelect('psychologist.specializations', 'specialization')
      .where('appointmentType.id = :appointmentTypeId', { appointmentTypeId })
      .andWhere('psychologist.isActive = :isActive', { isActive: true })
      .getMany();
  }
}
