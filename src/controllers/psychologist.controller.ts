import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PsychologistService } from '@/services/psychologist.service';
import { Psychologist } from '@/entities/psychologist.entity';
import { AppointmentType } from '@/entities/appointment-type.entity';
import {
  CreatePsychologistDto,
  UpdatePsychologistDto,
} from '@/dto/psychologist.dto';

@ApiTags('psychologists')
@Controller('psychologists')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all psychologists with optional filtering' })
  @ApiQuery({ 
    name: 'appointmentTypeId', 
    required: false, 
    description: 'Filter psychologists by appointment type ID',
    type: Number
  })
  @ApiQuery({ 
    name: 'specializationId', 
    required: false, 
    description: 'Filter psychologists by specialization ID',
    type: Number
  })
  @ApiQuery({ 
    name: 'isActive', 
    required: false, 
    description: 'Filter by active status (true/false)',
    type: Boolean
  })
  @ApiResponse({
    status: 200,
    description: 'List of psychologists (filtered if query params provided)',
    type: [Psychologist],
  })
  async findAll(
    @Query('appointmentTypeId') appointmentTypeId?: string,
    @Query('specializationId') specializationId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<Psychologist[]> {
    const filters = {
      appointmentTypeId: appointmentTypeId ? parseInt(appointmentTypeId) : undefined,
      specializationId: specializationId ? parseInt(specializationId) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };
    
    return this.psychologistService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get psychologist by ID' })
  @ApiParam({ name: 'id', description: 'Psychologist ID' })
  @ApiResponse({
    status: 200,
    description: 'Psychologist found',
    type: Psychologist,
  })
  @ApiResponse({ status: 404, description: 'Psychologist not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Psychologist | null> {
    return this.psychologistService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new psychologist' })
  @ApiResponse({
    status: 201,
    description: 'Psychologist created successfully',
    type: Psychologist,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() psychologistData: CreatePsychologistDto,
  ): Promise<Psychologist> {
    return this.psychologistService.create(psychologistData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update psychologist' })
  @ApiParam({ name: 'id', description: 'Psychologist ID' })
  @ApiResponse({
    status: 200,
    description: 'Psychologist updated successfully',
    type: Psychologist,
  })
  @ApiResponse({ status: 404, description: 'Psychologist not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() psychologistData: UpdatePsychologistDto,
  ): Promise<Psychologist | null> {
    return this.psychologistService.update(id, psychologistData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete psychologist' })
  @ApiParam({ name: 'id', description: 'Psychologist ID' })
  @ApiResponse({
    status: 200,
    description: 'Psychologist deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Psychologist not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.psychologistService.remove(id);
    return { message: 'Psychologist deleted successfully' };
  }

  @Get(':id/appointment-types')
  @ApiOperation({ summary: 'Get available appointment types for a psychologist' })
  @ApiParam({ name: 'id', description: 'Psychologist ID' })
  @ApiResponse({
    status: 200,
    description: 'List of appointment types available for this psychologist',
    type: [AppointmentType],
  })
  @ApiResponse({ status: 404, description: 'Psychologist not found' })
  async getAppointmentTypes(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AppointmentType[]> {
    return this.psychologistService.getAvailableAppointmentTypes(id);
  }
}
