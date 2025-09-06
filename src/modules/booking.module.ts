import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '@/entities/booking.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';
import { BookingService } from '@/services/booking.service';
import { BookingController } from '@/controllers/booking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      TimeSlot,
      Psychologist,
      AppointmentType,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
