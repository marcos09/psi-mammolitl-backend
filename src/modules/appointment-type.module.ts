import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentType } from '@/entities/appointment-type.entity';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentTypeController } from '@/controllers/appointment-type.controller';
import { AppointmentTypeService } from '@/services/appointment-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentType, Psychologist])],
  controllers: [AppointmentTypeController],
  providers: [AppointmentTypeService],
  exports: [AppointmentTypeService],
})
export class AppointmentTypeModule {}
