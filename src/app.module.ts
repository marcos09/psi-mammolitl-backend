import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from '@/config/database.config';
import { PsychologistModule } from '@/modules/psychologist.module';
import { SpecializationModule } from '@/modules/specialization.module';
import { TimeSlotModule } from '@/modules/timeslot.module';
import { BookingModule } from '@/modules/booking.module';
import { AppointmentTypeModule } from './modules/appointment-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: ['.env.local', '.env'], // Load .env.local first, then .env
      cache: true, // Cache environment variables for better performance
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    PsychologistModule,
    SpecializationModule,
    TimeSlotModule,
    BookingModule,
    AppointmentTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
