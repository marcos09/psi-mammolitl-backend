import {
  IsDate,
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentTypeEnum } from '@/entities/appointment-type.entity';

export class CreateTimeSlotDto {
  @ApiProperty({
    example: '2024-01-15T09:00:00Z',
    description: 'Start time of the time slot',
  })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    example: '2024-01-15T10:00:00Z',
    description: 'End time of the time slot',
  })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the time slot is available for booking',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: 'Morning consultation slot',
    description: 'Optional notes about the time slot',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the psychologist this time slot belongs to',
  })
  @IsNumber()
  psychologistId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the appointment type for this time slot',
    enum: AppointmentTypeEnum,
  })
  @IsNumber()
  appointmentTypeId: number;

  @ApiPropertyOptional({
    example: 'https://meet.google.com/abc-defg-hij',
    description:
      'Meeting link for online appointments (required for online type)',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.appointmentTypeId === AppointmentTypeEnum.ONLINE)
  meetingLink?: string;

  @ApiPropertyOptional({
    example: '123 Main St, City, State 12345',
    description:
      'Address for on-site or at-home appointments (required for on_site and at_home types)',
  })
  @IsOptional()
  @IsString()
  @ValidateIf(
    (o) =>
      o.appointmentTypeId === AppointmentTypeEnum.ON_SITE ||
      o.appointmentTypeId === AppointmentTypeEnum.AT_HOME,
  )
  address?: string;
}

export class UpdateTimeSlotDto {
  @ApiPropertyOptional({
    example: '2024-01-15T09:00:00Z',
    description: 'Start time of the time slot',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime?: Date;

  @ApiPropertyOptional({
    example: '2024-01-15T10:00:00Z',
    description: 'End time of the time slot',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the time slot is available for booking',
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: 'Morning consultation slot',
    description: 'Optional notes about the time slot',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the psychologist this time slot belongs to',
  })
  @IsOptional()
  @IsNumber()
  psychologistId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the appointment type for this time slot',
    enum: AppointmentTypeEnum,
  })
  @IsOptional()
  @IsNumber()
  appointmentTypeId?: number;

  @ApiPropertyOptional({
    example: 'https://meet.google.com/abc-defg-hij',
    description: 'Meeting link for online appointments',
  })
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiPropertyOptional({
    example: '123 Main St, City, State 12345',
    description: 'Address for on-site or at-home appointments',
  })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateTimeSlotStatusDto {
  @ApiProperty({
    example: true,
    description: 'Whether the time slot is available for booking',
  })
  @IsBoolean()
  isAvailable: boolean;
}

export class TimeSlotQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by psychologist ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  psychologistId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by specialization ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  specializationId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by appointment type ID (1=Online, 2=On-Site, 3=At-Home)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  appointmentTypeId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by availability status (defaults to true if not specified)',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Show only future time slots (start time after current time)',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  futureOnly?: boolean;

  @ApiPropertyOptional({
    example: '2024-01-15T00:00:00Z',
    description: 'Filter time slots starting from this date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2024-01-31T23:59:59Z',
    description: 'Filter time slots ending before this date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

export class TimeSlotAvailableFutureQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by psychologist ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  psychologistId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by specialization ID',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  specializationId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by appointment type ID (1=Online, 2=On-Site, 3=At-Home)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  appointmentTypeId?: number;

  @ApiPropertyOptional({
    example: '2024-01-15T00:00:00Z',
    description: 'Filter time slots starting from this date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2024-01-31T23:59:59Z',
    description: 'Filter time slots ending before this date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
