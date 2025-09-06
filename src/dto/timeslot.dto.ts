import { IsDate, IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimeSlotDto {
  @ApiProperty({ example: '2024-01-15T09:00:00Z', description: 'Start time of the time slot' })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'End time of the time slot' })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiPropertyOptional({ example: true, description: 'Whether the time slot is available for booking', default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 'Morning consultation slot', description: 'Optional notes about the time slot' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 1, description: 'ID of the psychologist this time slot belongs to' })
  @IsNumber()
  psychologistId: number;
}

export class UpdateTimeSlotDto {
  @ApiPropertyOptional({ example: '2024-01-15T09:00:00Z', description: 'Start time of the time slot' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime?: Date;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z', description: 'End time of the time slot' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @ApiPropertyOptional({ example: true, description: 'Whether the time slot is available for booking' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 'Morning consultation slot', description: 'Optional notes about the time slot' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the psychologist this time slot belongs to' })
  @IsOptional()
  @IsNumber()
  psychologistId?: number;
}

export class UpdateTimeSlotStatusDto {
  @ApiProperty({ example: true, description: 'Whether the time slot is available for booking' })
  @IsBoolean()
  isAvailable: boolean;
}
