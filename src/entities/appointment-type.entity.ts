import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '@/entities/base.entity';
import { Psychologist } from '@/entities/psychologist.entity';

export enum AppointmentTypeEnum {
  ONLINE = 'online',
  ON_SITE = 'on_site',
  AT_HOME = 'at_home',
}

@Entity('appointment_types')
export class AppointmentType extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: AppointmentTypeEnum;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Psychologist, 'appointmentTypes')
  psychologists: Psychologist[];
}
