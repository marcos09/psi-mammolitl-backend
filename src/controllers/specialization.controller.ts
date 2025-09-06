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
import { SpecializationService } from '@/services/specialization.service';
import { Specialization } from '@/entities/specialization.entity';
import { CreateSpecializationDto, UpdateSpecializationDto } from '@/dto/specialization.dto';

@ApiTags('specializations')
@Controller('specializations')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @Get()
  async findAll(): Promise<Specialization[]> {
    return this.specializationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Specialization | null> {
    return this.specializationService.findOne(id);
  }

  @Post()
  async create(@Body() specializationData: CreateSpecializationDto): Promise<Specialization> {
    return this.specializationService.create(specializationData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() specializationData: UpdateSpecializationDto,
  ): Promise<Specialization | null> {
    return this.specializationService.update(id, specializationData);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.specializationService.remove(id);
    return { message: 'Specialization deleted successfully' };
  }
}
