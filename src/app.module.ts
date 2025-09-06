import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from '@/config/database.config';
import { PsychologistModule } from '@/modules/psychologist.module';
import { SpecializationModule } from '@/modules/specialization.module';
import { TimeSlotModule } from '@/modules/timeslot.module';
import { BookingModule } from '@/modules/booking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    PsychologistModule,
    SpecializationModule,
    TimeSlotModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
