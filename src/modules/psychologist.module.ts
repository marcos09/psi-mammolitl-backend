import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';
import { PsychologistController } from '@/controllers/psychologist.controller';
import { PsychologistService } from '@/services/psychologist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Psychologist, AppointmentType])],
  controllers: [PsychologistController],
  providers: [PsychologistService],
  exports: [PsychologistService],
})
export class PsychologistModule {}
