import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from '@/entities/psychologist.entity';

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
  ) {}

  async findAll(): Promise<Psychologist[]> {
    return this.psychologistRepository.find();
  }

  async findOne(id: number): Promise<Psychologist | null> {
    return this.psychologistRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Psychologist | null> {
    return this.psychologistRepository.findOne({ where: { email } });
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Psychologist | null> {
    return this.psychologistRepository.findOne({ where: { licenseNumber } });
  }

  async create(psychologistData: Partial<Psychologist>): Promise<Psychologist> {
    const psychologist = this.psychologistRepository.create(psychologistData);
    return this.psychologistRepository.save(psychologist);
  }

  async update(id: number, psychologistData: Partial<Psychologist>): Promise<Psychologist | null> {
    await this.psychologistRepository.update(id, psychologistData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.psychologistRepository.delete(id);
  }
}
