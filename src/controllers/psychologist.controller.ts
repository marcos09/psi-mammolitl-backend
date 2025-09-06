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
import { PsychologistService } from '@/services/psychologist.service';
import { Psychologist } from '@/entities/psychologist.entity';
import { CreatePsychologistDto, UpdatePsychologistDto } from '@/dto/psychologist.dto';

@ApiTags('psychologists')
@Controller('psychologists')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all psychologists' })
  @ApiResponse({ status: 200, description: 'List of all psychologists', type: [Psychologist] })
  async findAll(): Promise<Psychologist[]> {
    return this.psychologistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get psychologist by ID' })
  @ApiParam({ name: 'id', description: 'Psychologist ID' })
  @ApiResponse({ status: 200, description: 'Psychologist found', type: Psychologist })
  @ApiResponse({ status: 404, description: 'Psychologist not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Psychologist | null> {
    return this.psychologistService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new psychologist' })
  @ApiResponse({ status: 201, description: 'Psychologist created successfully', type: Psychologist })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() psychologistData: CreatePsychologistDto): Promise<Psychologist> {
    return this.psychologistService.create(psychologistData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update psychologist' })
  @ApiParam({ name: 'id', description: 'Psychologist ID' })
  @ApiResponse({ status: 200, description: 'Psychologist updated successfully', type: Psychologist })
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
  @ApiResponse({ status: 200, description: 'Psychologist deleted successfully' })
  @ApiResponse({ status: 404, description: 'Psychologist not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.psychologistService.remove(id);
    return { message: 'Psychologist deleted successfully' };
  }
}
