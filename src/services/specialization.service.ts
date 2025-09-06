import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from '@/entities/specialization.entity';

@Injectable()
export class SpecializationService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}

  async findAll(): Promise<Specialization[]> {
    return this.specializationRepository.find();
  }

  async findOne(id: number): Promise<Specialization | null> {
    return this.specializationRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Specialization | null> {
    return this.specializationRepository.findOne({ where: { name } });
  }

  async create(specializationData: Partial<Specialization>): Promise<Specialization> {
    const specialization = this.specializationRepository.create(specializationData);
    return this.specializationRepository.save(specialization);
  }

  async update(id: number, specializationData: Partial<Specialization>): Promise<Specialization | null> {
    await this.specializationRepository.update(id, specializationData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.specializationRepository.delete(id);
  }
}
