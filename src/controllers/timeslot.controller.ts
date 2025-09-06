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
import { CreateTimeSlotDto, UpdateTimeSlotDto, TimeSlotQueryDto, TimeSlotAvailableFutureQueryDto } from '@/dto/timeslot.dto';

@ApiTags('time-slots')
@Controller('time-slots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get time slots with comprehensive filtering',
    description: 'Retrieve time slots with flexible filtering options. By default, only available timeslots are returned. All query parameters are optional and can be combined.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of time slots matching the specified filters (defaults to available only)', 
    type: [TimeSlot] 
  })
  async findAll(@Query() query: TimeSlotQueryDto): Promise<TimeSlot[]> {
    return this.timeSlotService.findWithFilters(query);
  }

  @Get('bookable')
  @ApiOperation({ 
    summary: 'Get bookable time slots',
    description: 'Retrieve only available time slots that are in the future and can be booked. This endpoint is optimized for booking scenarios and returns timeslots that are both available and in the future. Equivalent to GET /time-slots?isAvailable=true&futureOnly=true'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of bookable time slots matching the specified filters', 
    type: [TimeSlot] 
  })
  async findBookable(@Query() query: TimeSlotAvailableFutureQueryDto): Promise<TimeSlot[]> {
    return this.timeSlotService.findAvailableFuture(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific time slot by ID' })
  @ApiParam({ name: 'id', description: 'Time slot ID' })
  @ApiResponse({ status: 200, description: 'Time slot details', type: TimeSlot })
  @ApiResponse({ status: 404, description: 'Time slot not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TimeSlot | null> {
    return this.timeSlotService.findOne(id);
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
