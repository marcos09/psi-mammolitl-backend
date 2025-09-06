import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@/entities/base.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Specialization } from '@/entities/specialization.entity';

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column()
  clientName: string;

  @Column()
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, cancelled, completed

  @OneToOne(() => TimeSlot, timeSlot => timeSlot.booking, { eager: true })
  @JoinColumn({ name: 'timeSlotId' })
  timeSlot: TimeSlot;

  @Column()
  timeSlotId: number;

  @ManyToOne(() => Specialization, { eager: true })
  @JoinColumn({ name: 'specializationId' })
  specialization: Specialization;

  @Column()
  specializationId: number;
}
