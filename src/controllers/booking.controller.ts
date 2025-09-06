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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingService } from '@/services/booking.service';
import { Booking } from '@/entities/booking.entity';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
} from '@/dto/booking.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Booking | null> {
    return this.bookingService.findOne(id);
  }

  @Get('time-slot/:timeSlotId')
  async findByTimeSlot(
    @Param('timeSlotId', ParseIntPipe) timeSlotId: number,
  ): Promise<Booking | null> {
    return this.bookingService.findByTimeSlot(timeSlotId);
  }

  @Get('client/:email')
  async findByClientEmail(@Param('email') email: string): Promise<Booking[]> {
    return this.bookingService.findByClientEmail(email);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<Booking[]> {
    return this.bookingService.findByStatus(status);
  }

  @Post()
  async create(@Body() bookingData: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(bookingData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() bookingData: UpdateBookingDto,
  ): Promise<Booking | null> {
    return this.bookingService.update(id, bookingData);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookingStatusDto,
  ): Promise<Booking | null> {
    return this.bookingService.updateStatus(id, body.status);
  }

  @Put(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number): Promise<Booking | null> {
    return this.bookingService.cancel(id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.bookingService.remove(id);
    return { message: 'Booking deleted successfully' };
  }
}
