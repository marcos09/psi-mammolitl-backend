import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '@/entities/base.entity';
import { Specialization } from '@/entities/specialization.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';

@Entity('psychologists')
export class Psychologist extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Specialization, { eager: true })
  @JoinTable({
    name: 'psychologist_specializations',
    joinColumn: { name: 'psychologistId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specializationId', referencedColumnName: 'id' },
  })
  specializations: Specialization[];

  @ManyToMany(() => AppointmentType, { eager: true })
  @JoinTable({
    name: 'psychologist_appointment_types',
    joinColumn: { name: 'psychologistId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'appointmentTypeId',
      referencedColumnName: 'id',
    },
  })
  appointmentTypes: AppointmentType[];
}
