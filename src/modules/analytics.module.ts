import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from '@/controllers/analytics.controller';
import { AnalyticsService } from '@/services/analytics.service';
import { Booking } from '@/entities/booking.entity';
import { TimeSlot } from '@/entities/timeslot.entity';
import { Specialization } from '@/entities/specialization.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      TimeSlot,
      Specialization,
      AppointmentType,
      Psychologist,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
