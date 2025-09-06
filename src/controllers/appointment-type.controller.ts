import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppointmentTypeService } from '../services/appointment-type.service';
import {
  CreateAppointmentTypeDto,
  UpdateAppointmentTypeDto,
} from '../dto/appointment-type.dto';
import { AppointmentType } from '../entities/appointment-type.entity';
import { Psychologist } from '../entities/psychologist.entity';

@ApiTags('appointment-types')
@Controller('appointment-types')
export class AppointmentTypeController {
  constructor(
    private readonly appointmentTypeService: AppointmentTypeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment type' })
  @ApiResponse({
    status: 201,
    description: 'Appointment type created successfully',
    type: AppointmentType,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(
    @Body() createAppointmentTypeDto: CreateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    return this.appointmentTypeService.create(createAppointmentTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active appointment types' })
  @ApiResponse({
    status: 200,
    description: 'List of appointment types',
    type: [AppointmentType],
  })
  findAll(): Promise<AppointmentType[]> {
    return this.appointmentTypeService.findAll();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all appointment types (including inactive)' })
  @ApiResponse({
    status: 200,
    description: 'List of all appointment types',
    type: [AppointmentType],
  })
  findAllIncludingInactive(): Promise<AppointmentType[]> {
    return this.appointmentTypeService.findAllIncludingInactive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment type by ID' })
  @ApiParam({ name: 'id', description: 'Appointment type ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment type found',
    type: AppointmentType,
  })
  @ApiResponse({ status: 404, description: 'Appointment type not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AppointmentType> {
    return this.appointmentTypeService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get appointment type by code' })
  @ApiParam({ name: 'code', description: 'Appointment type code' })
  @ApiResponse({
    status: 200,
    description: 'Appointment type found',
    type: AppointmentType,
  })
  @ApiResponse({ status: 404, description: 'Appointment type not found' })
  async findByCode(@Param('code') code: string): Promise<AppointmentType> {
    const appointmentType = await this.appointmentTypeService.findByCode(code);
    if (!appointmentType) {
      throw new NotFoundException(
        `Appointment type with code ${code} not found`,
      );
    }
    return appointmentType;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment type' })
  @ApiParam({ name: 'id', description: 'Appointment type ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment type updated successfully',
    type: AppointmentType,
  })
  @ApiResponse({ status: 404, description: 'Appointment type not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentTypeDto: UpdateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    return this.appointmentTypeService.update(id, updateAppointmentTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment type (soft delete)' })
  @ApiParam({ name: 'id', description: 'Appointment type ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment type deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Appointment type not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.appointmentTypeService.remove(id);
  }

  // New endpoint to get psychologists offering a specific appointment type
  @Get(':id/psychologists')
  @ApiOperation({
    summary: 'Get psychologists offering a specific appointment type',
  })
  @ApiParam({ name: 'id', description: 'Appointment type ID' })
  @ApiResponse({
    status: 200,
    description: 'List of psychologists offering the appointment type',
    type: [Psychologist],
  })
  @ApiResponse({ status: 404, description: 'Appointment type not found' })
  getPsychologistsByAppointmentType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Psychologist[]> {
    return this.appointmentTypeService.getPsychologistsByAppointmentType(id);
  }
}
