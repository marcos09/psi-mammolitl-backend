import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@/entities/base.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { Booking } from '@/entities/booking.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';

@Entity('time_slots')
export class TimeSlot extends BaseEntity {
  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Psychologist, { eager: true })
  @JoinColumn({ name: 'psychologistId' })
  psychologist: Psychologist;

  @Column()
  psychologistId: number;

  @ManyToOne(() => AppointmentType, { eager: true })
  @JoinColumn({ name: 'appointmentTypeId' })
  appointmentType: AppointmentType;

  @Column()
  appointmentTypeId: number;

  @Column({ nullable: true })
  meetingLink: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => Booking, booking => booking.timeSlot)
  booking: Booking;
}
