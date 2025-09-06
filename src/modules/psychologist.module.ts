import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psychologist } from '@/entities/psychologist.entity';
import { PsychologistService } from '@/services/psychologist.service';
import { PsychologistController } from '@/controllers/psychologist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Psychologist])],
  controllers: [PsychologistController],
  providers: [PsychologistService],
  exports: [PsychologistService],
})
export class PsychologistModule {}
