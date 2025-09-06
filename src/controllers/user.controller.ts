import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PsychologistService } from '../services/psychologist.service';
import { Psychologist } from '../entities/psychologist.entity';

@Controller('psychologists')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Get()
  async findAll(): Promise<Psychologist[]> {
    return this.psychologistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Psychologist | null> {
    return this.psychologistService.findOne(id);
  }

  @Post()
  async create(@Body() psychologistData: Partial<Psychologist>): Promise<Psychologist> {
    return this.psychologistService.create(psychologistData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() psychologistData: Partial<Psychologist>,
  ): Promise<Psychologist | null> {
    return this.psychologistService.update(id, psychologistData);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.psychologistService.remove(id);
    return { message: 'Psychologist deleted successfully' };
  }
}
