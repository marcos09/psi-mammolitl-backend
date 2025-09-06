import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/entities/base.entity';

@Entity('specializations')
export class Specialization extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}
