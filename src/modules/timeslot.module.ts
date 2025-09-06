import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from '@/entities/timeslot.entity';
import { TimeSlotService } from '@/services/timeslot.service';
import { TimeSlotController } from '@/controllers/timeslot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot])],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
