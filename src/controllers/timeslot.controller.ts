import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TimeSlotService } from '@/services/timeslot.service';
import { TimeSlot } from '@/entities/timeslot.entity';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from '@/dto/timeslot.dto';

@ApiTags('time-slots')
@Controller('time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Get()
  @ApiOperation({ summary: 'Get all time slots' })
  @ApiResponse({ status: 200, description: 'List of all time slots', type: [TimeSlot] })
  async findAll(): Promise<TimeSlot[]> {
    return this.timeSlotService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TimeSlot | null> {
    return this.timeSlotService.findOne(id);
  }

  @Get('psychologist/:psychologistId')
  async findByPsychologist(
    @Param('psychologistId', ParseIntPipe) psychologistId: number,
  ): Promise<TimeSlot[]> {
    return this.timeSlotService.findByPsychologist(psychologistId);
  }

  @Get('psychologist/:psychologistId/available')
  async findAvailableByPsychologist(
    @Param('psychologistId', ParseIntPipe) psychologistId: number,
  ): Promise<TimeSlot[]> {
    return this.timeSlotService.findAvailableByPsychologist(psychologistId);
  }

  @Get('psychologist/:psychologistId/available/future')
  async findAvailableFutureByPsychologist(
    @Param('psychologistId', ParseIntPipe) psychologistId: number,
  ): Promise<TimeSlot[]> {
    return this.timeSlotService.findAvailableFutureByPsychologist(psychologistId);
  }

  @Get('available/specialization/:specializationId')
  @ApiOperation({ summary: 'Get available future time slots by specialization' })
  @ApiParam({ name: 'specializationId', description: 'Specialization ID' })
  @ApiResponse({ status: 200, description: 'List of available future time slots for psychologists with the specified specialization', type: [TimeSlot] })
  async findAvailableFutureBySpecialization(
    @Param('specializationId', ParseIntPipe) specializationId: number,
  ): Promise<TimeSlot[]> {
    return this.timeSlotService.findAvailableFutureBySpecialization(specializationId);
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<TimeSlot[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.timeSlotService.findByDateRange(start, end);
  }

  @Get('psychologist/:psychologistId/date-range')
  async findByPsychologistAndDateRange(
    @Param('psychologistId', ParseIntPipe) psychologistId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<TimeSlot[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.timeSlotService.findByPsychologistAndDateRange(
      psychologistId,
      start,
      end,
    );
  }

  @Post()
  async create(@Body() timeSlotData: CreateTimeSlotDto): Promise<TimeSlot> {
    return this.timeSlotService.create(timeSlotData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() timeSlotData: UpdateTimeSlotDto,
  ): Promise<TimeSlot | null> {
    return this.timeSlotService.update(id, timeSlotData);
  }

  @Put(':id/unavailable')
  async markAsUnavailable(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TimeSlot | null> {
    return this.timeSlotService.markAsUnavailable(id);
  }

  @Put(':id/available')
  async markAsAvailable(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TimeSlot | null> {
    return this.timeSlotService.markAsAvailable(id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.timeSlotService.remove(id);
    return { message: 'Time slot deleted successfully' };
  }
}
