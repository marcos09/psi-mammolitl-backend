import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';

interface PsychologistFilters {
  appointmentTypeId?: number;
  specializationId?: number;
  isActive?: boolean;
}

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
    @InjectRepository(AppointmentType)
    private appointmentTypeRepository: Repository<AppointmentType>,
  ) {}

  async findAll(filters: PsychologistFilters = {}): Promise<Psychologist[]> {
    const queryBuilder = this.psychologistRepository
      .createQueryBuilder('psychologist')
      .leftJoinAndSelect('psychologist.appointmentTypes', 'appointmentType')
      .leftJoinAndSelect('psychologist.specializations', 'specialization');

    // Apply filters
    if (filters.appointmentTypeId) {
      queryBuilder.andWhere('appointmentType.id = :appointmentTypeId', {
        appointmentTypeId: filters.appointmentTypeId,
      });
    }

    if (filters.specializationId) {
      queryBuilder.andWhere('specialization.id = :specializationId', {
        specializationId: filters.specializationId,
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('psychologist.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Psychologist | null> {
    return this.psychologistRepository.findOne({ 
      where: { id },
      relations: ['appointmentTypes', 'specializations']
    });
  }

  async findByEmail(email: string): Promise<Psychologist | null> {
    return this.psychologistRepository.findOne({ where: { email } });
  }

  async findByLicenseNumber(
    licenseNumber: string,
  ): Promise<Psychologist | null> {
    return this.psychologistRepository.findOne({ where: { licenseNumber } });
  }

  async create(psychologistData: Partial<Psychologist>): Promise<Psychologist> {
    const psychologist = this.psychologistRepository.create(psychologistData);
    return this.psychologistRepository.save(psychologist);
  }

  async update(
    id: number,
    psychologistData: Partial<Psychologist>,
  ): Promise<Psychologist | null> {
    await this.psychologistRepository.update(id, psychologistData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.psychologistRepository.delete(id);
  }

  // New methods for managing appointment types
  async addAppointmentType(
    psychologistId: number,
    appointmentTypeId: number,
  ): Promise<Psychologist | null> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: psychologistId },
      relations: ['appointmentTypes'],
    });

    if (!psychologist) {
      return null;
    }

    const appointmentType = await this.appointmentTypeRepository.findOne({
      where: { id: appointmentTypeId },
    });

    if (!appointmentType) {
      return null;
    }

    // Check if the appointment type is already associated
    const isAlreadyAssociated = psychologist.appointmentTypes.some(
      (at) => at.id === appointmentTypeId,
    );

    if (!isAlreadyAssociated) {
      psychologist.appointmentTypes.push(appointmentType);
      await this.psychologistRepository.save(psychologist);
    }

    return this.findOne(psychologistId);
  }

  async removeAppointmentType(
    psychologistId: number,
    appointmentTypeId: number,
  ): Promise<Psychologist | null> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: psychologistId },
      relations: ['appointmentTypes'],
    });

    if (!psychologist) {
      return null;
    }

    psychologist.appointmentTypes = psychologist.appointmentTypes.filter(
      (at) => at.id !== appointmentTypeId,
    );

    await this.psychologistRepository.save(psychologist);
    return this.findOne(psychologistId);
  }

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

  async getAvailableAppointmentTypes(
    psychologistId: number,
  ): Promise<AppointmentType[]> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: psychologistId },
      relations: ['appointmentTypes'],
    });

    return psychologist?.appointmentTypes || [];
  }
}
